import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL, // Este tipo de valor só existira para a API e NÃO EXISTIRÁ NO BD
      password_hash: Sequelize.STRING,
      provider: Sequelize.STRING,
    },
    { sequelize });

    this.addHook('beforeSave', async (user) => { // Similar aos middlewares, os hooks serão sempre executados de acordo com seus nomes de funções, no caso, antes de incluir um novo registro
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
