const express = require('express');
const cors = require('cors');
const tokenize = require('./lib/tokenizer');

const app = express();

// headers managers
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

// request parsers
app.use(express.json({ limit: '2MB' }));
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const url = req.query.url || process.env.TOKENIZER_DEFAULT_URL;
    try {
        const tokenizerMap = await tokenize.tokenizerUrl(url);
        const result = Object.values(tokenizerMap);
        res.json({
            url,
            tokenizer: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = app;
