const fs = require('fs')

function progressTracker(trackFilePath){
    const progressArray = progressTrackerArr(trackFilePath)
    const returnString = progressArray.join('\n')
    const date = new Date()

    const fileName = `Student_Progress_${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}.txt`

    fs.writeFileSync(fileName, returnString)

    return `File "${fileName}" saved!`
}

function progressTrackerArr(trackFilePath) {
    const data = fs.readFileSync(trackFilePath, 'utf8')
    const studentDataArray = data.split('\n')
    const studentArr = studentDataArray.map((element) => {
        return extractNameAndTasks(element)

    })
    const sortedArr = studentArr.sort((person1, person2) => {
        return person1.tasks - person2.tasks
    })
    const stringedArr = sortedArr.map((studentObj)=>{
        return `Task ${studentObj.tasks} - ${studentObj.name}`

    })
    return stringedArr
}

function extractNameAndTasks(string){
    const splitString = string.split(' ')
    const wordsAndTasks = splitString.filter((element) => {return element !== ''})
    let tasksOnly = true
    return wordsAndTasks.reduce((outcome, element) => {
        if (element === 'X' && tasksOnly === true){
            outcome.tasks++
            return outcome
        } else if(element !== 'X' && tasksOnly === true){
            tasksOnly = false
            outcome.name = element
            return outcome
        }
        else if (tasksOnly === false){
            outcome.name = outcome.name + ' ' + element
            return outcome
        }
    },{tasks : 0})
}

module.exports = {progressTracker, progressTrackerArr, extractNameAndTasks}