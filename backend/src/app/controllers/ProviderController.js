import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true }, // Condição da busca no banco de dados
      attributes: ['id', 'name', 'email', 'avatar_id'], // Valores que serão pesquisados
      include: [{ // Seria o JOIN do SQL para pesquisas mais complexas
        model: File, // Modelo da foreignKey
        as: 'avatar', // alias
        attributes: ['name', 'path', 'url'], // Valores que serão mostrados
      }],
    });

    res.json(providers);
  }
}

export default new ProviderController();
