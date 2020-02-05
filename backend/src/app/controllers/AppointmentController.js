import {
  startOfHour, parseISO, isBefore, format, subHours,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) { return res.status(400).json({ error: 'Validation fails' }); }

    const { provider_id, date } = req.body;

    const checkIsProvider = await User.findOne({ where: { id: provider_id, provider: true } });

    if (!checkIsProvider) {
      return res.status(401).json({ error: 'You can only create appointments with providers' });
    }

    /*
    ParseIso -> transforma os valores de [date] recebidos em um objeto do tipo Date
    startOfHour -> Transforma as horas recebidas, se não forem horas cheias,
    em horas cheias (19:32:00 -> 19:00)
    */
    const hourStart = startOfHour(parseISO(date));

    // Verifica se a hora recebida não é uma hora retroativa a data e hora atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // Verifica se já não uma horário marcado para esta prestador de serviços
    const checkAvailabity = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailabity) { return res.status(400).json({ error: 'Appointment date is not available' }); }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM 'às' hh':'mm");

    // Notifica o provedor de serviços
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],

    });

    if (appointment.user_id !== req.userId) { return res.status(401).json({ error: "You don't have permission to cancel this appointment." }); }

    const dateWithSub = subHours(appointment.date, 2);

    /*
    Os cancelamentos só serão permitidos
    Se a hora do momento do pedido do cancelamento, estiver a 2 horas de "distancia"
    da hora do agendamento
    */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance' });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'Dia' dd 'de' MMMM', às' H:mm", { locale: ptBR }),
      },
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
