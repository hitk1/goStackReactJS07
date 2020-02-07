import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  // Função a ser executada quando beequeue chamar essa classe
  async handle({ data }) {
    const { appointment } = data;

    Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'Dia' dd 'de' MMMM', às' H:mm", { locale: pt }),
      },
    });
  }
}

export default new CancellationMail();
