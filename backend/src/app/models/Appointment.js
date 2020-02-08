import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: { // Indica se o agendamento ja ocorreu, ou seja, se a data é anterior a data atual
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.date, new Date());
        },
      },
      /*
        Indica se o agendamento é cancelável ou não
        de acordo com a regra de negócio de cancelmentos permitidos com até 2 horas de antescedencia
      */
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subHours(this.date, 2));
        },
      },
    },
    { sequelize });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
