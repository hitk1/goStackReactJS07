import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) { return res.status(400).json({ error: 'Validation fails' }); }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) { return res.status(400).json({ error: 'User already exists' }); }

    const {
      id, name, email, provider,
    } = await User.create(req.body);

    return res.json({
      id, name, email, provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6)
        .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      /* When é muito utilizado para fazer valições condicionais
        No caso, se o [oldPassword] for informado, password será obrigatório, caso contrário, não */

      confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
      /* Neste caso, a validação é feita se existir [password], então [confirmPassword] será obrigatório e terá de ser identico a [password]
      Pra fazer isso, o metodo [oneOf()] é utilizado passando por parametro um Array contendo a referência do atributo no qual deve ser igual [ref('')] */
    });

    if (!(await schema.isValid(req.body))) { return res.status(400).json({ error: 'Validation fails' }); }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) { return res.status(400).json({ error: 'User already exists' }); }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id, name, email, provider,
    });
  }
}

export default new UserController();
