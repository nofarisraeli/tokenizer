const { parentPort, workerData } = require('worker_threads');
const { normalizeWord } = require('../utils');

const { text, regex } = workerData;

const run = () => {
    const wordsMap = {};

    const words = text.match(regex);

    words.forEach((word) => {
        word = normalizeWord(word);
        const wordRepetitions = wordsMap[word] ? wordsMap[word].repetitions : 0;
        wordsMap[word] = { word, repetitions: wordRepetitions + 1 };
    });

    parentPort.postMessage(wordsMap);
};

run();
