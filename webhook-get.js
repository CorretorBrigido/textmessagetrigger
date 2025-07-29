require('dotenv').config(); // Carrega variáveis de ambiente do .env
const express = require('express');
const routerGet = express.Router(); // cria o roteador

// GET usado pela Meta para validar o token
routerGet.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // defina seu token fixo aqui

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

module.exports = routerGet;
// exporta o roteador completo