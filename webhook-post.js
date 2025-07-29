// webhook-post.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { mensagensRecebidas } = require('./sharedData'); // <-- aqui está o compartilhamento

router.post('/', async (req, res) => {
  const body = req.body;

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  ) {
    const mensagem = body.entry[0].changes[0].value.messages[0];
    const numero = mensagem.from;
    const texto = mensagem.text?.body || '[sem texto]';
    const horario = new Date().toLocaleString();

    console.log('📥 Nova mensagem recebida:', { numero, texto, horario });

    // Salvar para uso posterior no Excel
    mensagensRecebidas.push({
      nome: numero,
      'data e hora': horario,
      mensagem: texto,
    });

    try {
      const resposta = await fetch("https://graph.facebook.com/v17.0/731781896682183/messages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`, // use variável de ambiente
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numero,
          type: "text",
          text: {
            body: "Olá! Sou a assistente virtual da nossa equipe. 🤖 [...]"
          }
        })
      });

      const data = await resposta.json();
      console.log("📤 Mensagem automática enviada:", data);
    } catch (error) {
      console.error("❌ Erro ao enviar resposta automática:", error);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
