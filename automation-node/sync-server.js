const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/sync', (req, res) => {
    const { fileName, data } = req.body;

    if (!fileName || !data) {
        return res.status(400).send('Dados ou nome do arquivo ausentes.');
    }

    try {
        console.log(`Recebendo solicitação de sincronização: ${fileName}`);
        
        // 1. Criar o arquivo Excel localmente
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'estoque_net');
        
        const filePath = path.join(__dirname, fileName);
        XLSX.writeFile(workbook, filePath);
        
        console.log(`Arquivo gerado em: ${filePath}`);

        // 2. Executar o robô (index.js)
        const command = `node index.js "${fileName}"`;
        console.log(`Executando comando: ${command}`);

        const process = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o robô: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        // Retorna sucesso para o portal imediatamente (o robô continua rodando)
        res.status(200).send({ message: 'Robô iniciado', fileName: fileName });

    } catch (err) {
        console.error('Erro no processamento do servidor:', err);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 SERVIDOR DE SINCRONIZAÇÃO FFA RODANDO`);
    console.log(`📍 URL: http://localhost:${port}`);
    console.log(`🔑 Aguardando cliques no portal...`);
    console.log(`==================================================\n`);
});
