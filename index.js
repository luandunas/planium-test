const express = require('express');

//importando jsons
const prices = require('./api/prices.json');
const plans = require('./api/plans.json');

const app = express();
app.use(express.static('public'))
const port = 3000;

app.get('/api/prices', (req, res) => {
    res.json(prices);
});

app.get('/api/plans', (req, res) => {
    res.json(plans);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});