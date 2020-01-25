import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) { return res.status(401).json({ error: 'Token not provided' }); }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Inclui o ID do usuario dentro do objeto da requisição
    // para estar acessível em outros metodos sem haver a necessidade de um SELECT no banco
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
