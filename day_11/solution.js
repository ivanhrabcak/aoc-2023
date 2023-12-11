const fs = require('fs')

const expand = ([x, y], galaxyMap, addEmptySpace, lines, cols) => {
    let xExpansion = 0
    for (let dx = 0; dx < x; dx++) {
        const line = lines[dx]
        if (!line.includes('#')) {
            xExpansion += addEmptySpace
        }
    }


    let yExpansion = 0
    for (let dy = 0; dy < y; dy++) {
        const col = cols[dy]

        if (!col.includes('#')) {
            yExpansion += addEmptySpace
        }
    }

    return [x + xExpansion, y + yExpansion]
}

const partOne = (galaxyMap, lines, cols) => {
    const pointsOfInterest = []
    for (let i = 0; i < galaxyMap.length; i++) {
        for (let j = 0; j < galaxyMap[0].length; j++) {
            if (galaxyMap[i][j] == '#') {
                pointsOfInterest.push([i, j])
            }
        }
    }

    const distances = []
    for (let i = 0; i < pointsOfInterest.length; i++) {
        const [x1, y1] = expand(pointsOfInterest[i], galaxyMap, 1, lines, cols)
        for (let j = i + 1; j < pointsOfInterest.length; j++) {
            const [x2, y2] = expand(pointsOfInterest[j], galaxyMap, 1, lines, cols)

            
            const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2)
            distances.push(distance)
        }
    }

    return distances.reduce((acc, k) => acc + k, 0)
}

const partTwo = (galaxyMap, lines, cols) => {
    const pointsOfInterest = []
    for (let i = 0; i < galaxyMap.length; i++) {
        for (let j = 0; j < galaxyMap[0].length; j++) {
            if (galaxyMap[i][j] == '#') {
                pointsOfInterest.push([i, j])
            }
        }
    }

    const distances = []
    for (let i = 0; i < pointsOfInterest.length; i++) {
        const [x1, y1] = expand(pointsOfInterest[i], galaxyMap, 999999, lines, cols)
        for (let j = i + 1; j < pointsOfInterest.length; j++) {
            const [x2, y2] = expand(pointsOfInterest[j], galaxyMap, 999999, lines, cols)

            
            const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2)
            distances.push(distance)
        }
    }

    return distances.reduce((acc, k) => acc + k, 0)
}

const main = () => {
    const galaxyMap = fs.readFileSync('./input.txt').toString().split('\n')
        .map(l => [...l])

    const lines = []
    for (let x = 0; x < galaxyMap.length; x++) {
        lines.push(galaxyMap[x].join(''))
    }

    const cols = []
    for (let y = 0; y < galaxyMap[0].length; y++) {
        const col = new Array(galaxyMap.length).fill('.')
        for (let x = 0; x < galaxyMap.length; x++) {
            col[x] = galaxyMap[x][y]
        }

        cols.push(col.join(''))
    }
    
    console.log(partOne(galaxyMap, lines, cols))
    console.log(partTwo(galaxyMap, lines, cols))

    // console.log(expand(4, 6, galaxyMap, 1))
    
}

main()