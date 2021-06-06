/* eslint no-undef: "off" */
const { normalizeWord, indexOfByMultiChars, fetchTimeout } = require('../lib/utils');

// normalizeWord
test('normalize word with string', () => {
    const word = 'noFaR ELHADAD';
    expect(normalizeWord(word)).toBe('nofar elhadad');
});

test('normalize word with null or undefined', () => {
    try {
        normalizeWord(null);
    } catch (e) {
        expect(e.toString()).toMatch('TypeError: Cannot read property \'toLowerCase\' of null');
    }
});

// indexOfByMultiChars
test('index of by multiple chars', () => {
    const separatorChars = new Set([' ', '-']);
    const text = 'hello my name is nofar-elhadad';
    expect(indexOfByMultiChars(text, separatorChars)).toBe(5);
    expect(indexOfByMultiChars(text, separatorChars, 17)).toBe(22);
});

// fetchTimeout
test('index of by multiple chars', async () => {
    const response = await fetchTimeout('https://www.google.com', 1);
    expect(response.ok).toBe(false);
    expect(response.timeout).toBe(true);
});
