const express = require('express');
const fs = require('fs');

//importando jsons
const prices = require('./api/prices.json');
const plans = require('./api/plans.json');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.get('/api/prices', (req, res) => {
    res.json(prices);
});

app.get('/api/plans', (req, res) => {
    res.json(plans);
});

app.post('/api/beneficiarios', (req, res) => {
    let data = req.body
    fs.writeFile('./api/beneficiarios.json', JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            return res.status(400).send({
                message: 'Não foi possível criar o arquivo'
            });
        }
    });
    return res.status(200).send({
        message: 'Arquivo criado com sucesso'
    });
});

app.post('/api/proposta', (req, res) => {
    let data = req.body
    fs.writeFile('./api/proposta.json', JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            return res.status(400).send({
                message: 'Não foi possível criar o arquivo'
            });
        }
    });
    return res.status(200).send({
        message: 'Arquivo criado com sucesso'
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});