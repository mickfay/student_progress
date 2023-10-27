const {progressTracker, progressTrackerArr, extractNameAndTasks} = require('../student_progress')
const fs = require('fs')

const mockData = `X X X X                                      Student One
X X X X X X X                                Student Two
                                             Student Three
                                             X X X                                        Student Four
                                             X X X X                                      Student Five
                                             X X X X X X X X                              Student Six`
                                             
const spyFsReadFileSync = jest.spyOn(fs,'readFileSync')

describe('progressTrackerArr', () => {
    // Test of function mocking
    test('Function returns an array of one student when passed a textfile of one student', () => {
        console.log(fs)
        spyFsReadFileSync.mockReturnValue('X X X               Michael Fay')
        //const mockData = jest.fn(() => {return 'X X X               Michael Fay'})
        expect(progressTrackerArr('test.txt')).toEqual(['Task 3 - Michael Fay'])     
    });

    test('Function returns an array of two students when passed a file of multiple students with correct task numbers', () => {
        const mockData = 'X X X               Michael Fay\nX X X X X X            Daniel Craven'
        spyFsReadFileSync.mockReturnValue(mockData)
        const expectedOutput = ['Task 3 - Michael Fay', 'Task 6 - Daniel Craven']
        expect(progressTrackerArr('test.txt')).toEqual(expectedOutput)
    });
    test('Function correctly identifies a student with 0 tasks completed', () => {
        const mockData = '               Michael Fay\nX X X             Daniel Craven\nX X X X X X             Michael Tucker'
        spyFsReadFileSync.mockReturnValue(mockData)

        const expectedOutput = ['Task 0 - Michael Fay', 'Task 3 - Daniel Craven', 'Task 6 - Michael Tucker']
        expect(progressTrackerArr('test.txt')).toEqual(expectedOutput)
    });
    test('Function should not identify if a name has an "X " in, and ignore when calculating task number', () => {
        const mockData = 'X X X               Michael X Fay\nX X X X X X            Daniel Craven'
        spyFsReadFileSync.mockReturnValue(mockData)
        const expectedOutput = ['Task 3 - Michael X Fay', 'Task 6 - Daniel Craven']
        expect(progressTrackerArr('test.txt')).toEqual(expectedOutput)
    });
    test('Function should sort students in progress order', () => {
        const mockData = 'X X X             Michael Fay\n           Daniel Craven\nX X X X X X          Edward Norton\nX                Greta Hunberston'
        spyFsReadFileSync.mockReturnValue(mockData)
        const expectedOutput = ['Task 0 - Daniel Craven', 'Task 1 - Greta Hunberston', 'Task 3 - Michael Fay', 'Task 6 - Edward Norton']
        expect(progressTrackerArr('test.txt')).toEqual(expectedOutput)
    });
    test('Function should return correct values for tasks completed over 10', () => {
        const mockData = 'X X X X X X X X X X X X            Michael Fay\nX X X           Daniel Crave'
        spyFsReadFileSync.mockReturnValue(mockData)
        const expectedOutput = ['Task 12 - Michael Fay', 'Task 3 - Daniel Craven']
 
    });
});

describe('extractName', () => {
    test('Function should extract a name and tasks from a string containing Xes representing tasks', () => {
        const input = 'X X X X X X                      Michael Fay'
        const expectedOutput = {name : 'Michael Fay', tasks : 6}
        expect(extractNameAndTasks(input)).toEqual(expectedOutput)
    });
    test('Function should ignore Xes in the middle of names', () => {
        const input = 'X X X X                  Xavier X Xtreme'
        const expectedOutput = {name : 'Xavier X Xtreme', tasks : 4}
        expect(extractNameAndTasks(input)).toEqual(expectedOutput)
    })
    test('Function should return an object with 0 tasks if 0 tasks completed', () => {
        const input = '                 Michael X Fay'
        const expectedOutput = {name : 'Michael X Fay', tasks : 0}
    });
});

describe('progressTracker', () => {
    const RealDate = Date.now
    beforeAll(() => {
        global.Date.now = jest.fn(() => new Date('2023-27-10T10:20:30Z').getTime())
      })
      
      afterAll(() => {
        global.Date.now = RealDate
      })
    test('Function should return a string of the filename that has been created', () => {
        const mockData = '               Michael Fay\nX X X             Daniel Craven\nX X X X X X             Michael Tucker'
        spyFsReadFileSync.mockReturnValue(mockData)
        const result = progressTracker('example.txt')
        const expected = 'File "Student_Progress_27.10.2023.txt" saved!'
        expect(typeof result).toBe('string')
        expect(result).toBe(expected)
    });
    test('Function should write data to a new file, named by date', () => {
        const mockData = '               Michael Fay\nX X X             Daniel Craven\nX X X X X X             Michael Tucker'
        spyFsReadFileSync.mockReturnValue(mockData)
        progressTracker('example.txt')
        jest.restoreAllMocks()
        const writtenFile = fs.readFileSync('Student_Progress_27.10.2023.txt', 'utf8')
        const expectedOutput = 'Task 0 - Michael Fay\nTask 3 - Daniel Craven\nTask 6 - Michael Tucker'
        expect(writtenFile).toBe(expectedOutput)
        
    });
})