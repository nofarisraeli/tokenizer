const { Worker } = require('worker_threads');
const path = require('path');
const { fetchTimeout, indexOfByMultiChars } = require('../utils');
const config = require('../config');

const urlTokenizer = new Map();

/**
 * Worker thread promise by text
 * @param {string} text
 */
const workerTokenizer = (text) => new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, 'worker.js');
    const worker = new Worker(workerPath, { workerData: { text, regex: config.tokenizerRegexp } });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
});

/**
 * Prepare and return workers promise list by text length,
 * every promise member in the list represent a chunk of text processing(by worker-thread).
 * @param {string} text
 * @return {Array<Promise<any>>}
 */
const getWorkersPromiseArr = (text) => {
    const workersPromiseArr = [];

    const textLen = text.length;
    const chunkTextLen = Math.ceil(textLen / config.numOfThreads);
    let previousWorkerIndex = 0;

    for (let i = 0; i < config.numOfThreads && previousWorkerIndex < textLen; i++) {
        // search in text the index of first char we can separated by
        let firstSpacer = indexOfByMultiChars(text, config.separatorChars, previousWorkerIndex + chunkTextLen);
        if (firstSpacer === -1) {
            // in case no space found, the text substring will be over the all text
            firstSpacer = textLen;
        }

        workersPromiseArr.push(workerTokenizer(text.substring(previousWorkerIndex, firstSpacer))); // substring without the last space
        previousWorkerIndex = firstSpacer + 1;
    }
    return workersPromiseArr;
};

/**
 * Get tokenizer result from text
 * @param {string} text
 * @return {Promise<Object>}
 */
const tokenizerText = async (text) => {
    if (typeof text !== 'string' || !text) {
        throw new Error('invalid text input');
    }
    let tokenizerMap = null;

    const workersPromiseArr = getWorkersPromiseArr(text);
    const workerResponses = await Promise.all(workersPromiseArr);
    workerResponses.forEach((workerMap) => {
        // iterate and count from the 2nd map
        if (!tokenizerMap) {
            tokenizerMap = workerMap;
        } else {
            Object.keys(workerMap).forEach((word) => {
                const wordRepetitions = tokenizerMap[word] ? tokenizerMap[word].repetitions : 0;
                tokenizerMap[word] = { word, repetitions: wordRepetitions + workerMap[word].repetitions };
            });
        }
    });

    return tokenizerMap;
};

/**
 * Get tokenizer by url
 * @param {String} url
 * @return {Promise<Object>}
 */
const tokenizerUrl = (url) => {
    // validate url
    if (urlTokenizer.has(url)) {
        return urlTokenizer.get(url);
    }
    const tokenizePromise = new Promise(async (resolve) => {
        const response = await fetchTimeout(url, config.urlFetchTimeout);
        if (!response.ok) {
            if (response.timeout) {
                throw new Error('fetch Timeout');
            }
            throw new Error('failed to get url text');
        }
        const text = await response.text();
        resolve(await tokenizerText(text));
    });

    urlTokenizer.set(url, tokenizePromise);

    return tokenizePromise;
};

module.exports = { tokenizerUrl, tokenizerText };
