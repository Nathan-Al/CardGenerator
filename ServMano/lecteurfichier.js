let fs = require('fs')

let CopyFile = (chemin, destination) => {

    fs.stat(chemin, (err, stat) => {
        let total = stat.size
        let progress = 0
        let read = fs.createReadStream(chemin)
        let write = fs.createWriteStream(destination)

        read.on('data', (chunk) => {
            progress += chunk.length
            console.log(Math.round(100 * progress / total) + "%")
        })

        read.pipe(write)
        write.on('finish', () => {
            console.log("Fait")
        })

    })
}

module.exports = CopyFile