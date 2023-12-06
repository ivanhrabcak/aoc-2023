const fs = require('fs')

const partOne = (times, distances) => {
    return times.map((time, index) => {
        const recordDistance = distances[index]

        return new Array(time).fill((i) => i)
            .map((f, i) => f(i))
            .map((i) => (time - i) * i)
            .filter((distance) => distance > recordDistance).length
    }).reduce((acc, k) => acc * k, 1)
}

const partTwo = (time, distance) => {
    let recordRuns = 0
    for (let i = 0; i < time; i++) {
        const remainingMilliseconds = time - i

        const distanceTraveled = remainingMilliseconds * i
        if (distanceTraveled > distance) {
            recordRuns++
        }
    }

    return recordRuns
}

const main = () => {
    const [rawTimes, rawDistances] = fs.readFileSync('./input.txt').toString().split('\n')

    const times = rawTimes.split(':')[1]
        .split(' ')
        .map(k => parseInt(k))
        .filter(k => !isNaN(k))
    
    const distances = rawDistances.split(':')[1]
        .split(' ')
        .map(k => parseInt(k))
        .filter(k => !isNaN(k))

    const time = parseInt(rawTimes.split(':')[1].replace(/\s/g, ''))
    const distance = parseInt(rawDistances.split(':')[1].replace(/\s/g, ''))

    console.log(partOne(times, distances))
    console.log(partTwo(time, distance))
}

main()