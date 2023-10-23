const {readFile, progressTracker} = require('../student_progress')

describe('progressTracker', () => {
    
});

describe('readFile', () => {
    test('Function should read the data in a file', () => {
        expect(readFile('../test.txt')).toBe('This is a test file')
    });
});