/* eslint no-undef: "off" */

const { tokenizerText } = require('../lib/tokenizer');

test('tokenizer by text', async () => {
    const text = 'hello my Name IS NOFAR 123123 HELLO-1231212 nofar is 45646 my NAME hello nofar-name my-hello';
    const result = await tokenizerText(text);
    const toBe = {
        hello: {
            word: 'hello',
            repetitions: 4,
        },
        my: {
            word: 'my',
            repetitions: 3,
        },
        name: {
            word: 'name',
            repetitions: 3,
        },
        is: {
            word: 'is',
            repetitions: 2,
        },
        nofar: {
            word: 'nofar',
            repetitions: 3,
        },
    };
    expect(result).toEqual(toBe);
});
