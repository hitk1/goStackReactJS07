import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import routes from './routes';

import 'express-async-errors';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    // this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    /*
    [express.static()] é um método GET que serve arquivos estáticos do servidor
    Neste caso, servirá para prover as imagens de cada avatar
    */
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
    });
  }
}

export default new App().server;
