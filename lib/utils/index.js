const fetch = require('node-fetch');

module.exports = {
    /**
     * Return normalize word
     * @param {string} word
     * @return {string}
     */
    normalizeWord: (word) => word.toLowerCase(),

    /**
     * Fetch with timeout
     * @param {string} url
     * @param {number} ms
     * @param {Object} options
     * @return {Promise<Object>}
     */
    fetchTimeout: (url, ms, options = {}) => new Promise((async (resolve) => {
        let timeout = setTimeout(() => {
            timeout = null;
            resolve({ ok: false, timeout: true });
        }, ms);
        const response = await fetch(url, options);
        if (timeout) {
            clearTimeout(timeout);
            resolve(response);
        }
    })),

    /**
     * Return the index of first encounter with one of the searchBySet characters
     * @param {string} str
     * @param {Set} searchBySet
     * @param {number} startIndex
     * @return {number}
     */
    indexOfByMultiChars(str, searchBySet, startIndex = 0) {
        if (!str || typeof str !== 'string' || !(searchBySet instanceof Set) || !searchBySet.size) {
            return -1;
        }
        const strLen = str.length;

        for (let i = startIndex; i < strLen; i++) {
            if (searchBySet.has(str.charAt(i))) {
                return i;
            }
        }

        return -1;
    },
};
