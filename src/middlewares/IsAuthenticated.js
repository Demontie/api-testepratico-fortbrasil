const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

/**
 * Função responsável por verificar a veracidade do
 * token informado.
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ error: true, msg: 'Não autenticado' }, 401);
  }

  const token = authHeader.split(' ')[1];

  await jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.json({ error: true, msg: 'Não autenticado' }, 401);
    }
    req.userId = decoded.id;

    return decoded.id;
  });

  const check = await Token.findOne({ token });

  if (!check || check.expired) {
    return res.json({ error: true, msg: 'Não autenticado' }, 401);
  }

  return next();
};
