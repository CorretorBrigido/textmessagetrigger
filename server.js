require('dotenv').config(); // Carrega as variáveis do arquivo .env
const express = require('express'); // Framework para API
const webhookGet = require('./webhook-get'); // Router para o GET /webhook
const webhookPost = require('./webhook-post'); // Router para o POST /webhook
const { mensagensRecebidas } = require('./sharedData'); // Array de mensagens recebidas
const xl = require("excel4node"); // Biblioteca para gerar arquivos Excel
const path = require('path'); // Módulo para trabalhar com caminhos de arquivo

const app = express();
const port = process.env.PORT || 3000; // Usa a porta definida no .env ou padrão 3000

app.use(express.json()); // Middleware que permite ler JSON no corpo das requisições
app.use('/webhook', webhookGet); // Rota GET usada pela verificação do WhatsApp
app.use('/webhook', webhookPost); // Rota POST onde chegam mensagens do WhatsApp

/**
 * Rota que gera a planilha com as mensagens recebidas e envia para download.
 * Essa rota pode ser acessada de qualquer lugar (ex: navegador ou cURL).
 */
app.get('/exportar-excel', (req, res) => {
  // Cria um novo arquivo Excel
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Mensagens Recebidas');

  // Define os cabeçalhos das colunas
  const headers = ['Nome', 'Data e hora', 'Mensagem'];
  headers.forEach((h, i) => {
    ws.cell(1, i + 1).string(h);
  });

  // Preenche os dados linha por linha
  mensagensRecebidas.forEach((msg, row) => {
    ws.cell(row + 2, 1).string(msg.nome);
    ws.cell(row + 2, 2).string(msg['data e hora']);
    ws.cell(row + 2, 3).string(msg.mensagem);
  });

  // Define o nome do arquivo Excel para o download
  const nomeArquivo = 'MensagensRecebidas.xlsx';

  /**
   * Envia o arquivo diretamente como download (sem salvar no servidor)
   * Ideal para ambientes em nuvem onde não se deve gravar em disco
   */
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);

  // Gera o arquivo e envia no response
  wb.write(nomeArquivo, res);
});

app.listen(port, () => {
  console.log(`🟢 Servidor rodando na porta ${port}`);
  console.log('🌐 Acesse: http://localhost:' + port + '/exportar-excel para baixar a planilha');
});
