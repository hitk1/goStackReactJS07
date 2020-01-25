import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Inicializa a conexão com o banco de dados

    models.map((model) => model.init(this.connection)); // Carrega todos os models da aplicação
  }
}


export default new Database();
