import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Inicializa a conexão com o banco de dados

    models.map((model) => model.init(this.connection)); // Carrega todos os models da aplicação

    /* Esse lop será executado em casos onde há relacionamento entre as tabelas,
    ou seja, se houver o método [associate] há uma relação
    */
    models.map((model) => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://127.0.0.1:27017/gobarber',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true,
      },
    );
  }
}


export default new Database();
