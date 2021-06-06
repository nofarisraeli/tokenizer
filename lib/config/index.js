const os = require('os');

module.exports = {
    separatorChars: new Set([' ', '-']),
    tokenizerRegexp: new RegExp('[a-z]+', 'gi'),
    urlFetchTimeout: 15000,
    numOfThreads: parseInt(process.env.TOKENIZER_NUM_OF_THREADS) || os.cpus().length,
};
