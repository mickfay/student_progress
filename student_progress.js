const fs = require('fs')

function progressTracker(trackFilePath) {

}

function readFile(filePath){
    fs.readFile('../test.txt', 'utf8', (err, data) => {
        console.log(data)
    })
}


module.exports = {readFile, progressTracker}