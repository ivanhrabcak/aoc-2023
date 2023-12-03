const fs = require('fs')

const isDigit = (s) => s.charCodeAt(0) >= '0'.charCodeAt(0) && s.charCodeAt(0) <= '9'.charCodeAt(0)
const isInBounds = (x, y, a) =>
    x < a.length && x >= 0 && y < a[0].length && y >= 0

const shouldBeCounted = (i, j, lines, buf) => {
    for (let x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x > lines.length) {
            continue
        }

        for (let y = j - (buf.length + 1); y <= j; y++) {
            if (!isInBounds(x,  y, lines)) {
                continue
            }

            if (lines[x][y] != '.' && !isDigit(lines[x][y])) {
                return true
            }
        }
    }

    return false
}

const partTwo = (lines) => {
    lines = lines.map(l => `.${l}.`)

    const gearNeighbors = {}

    let buf = ''
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (isDigit(lines[i][j])) {
                buf += lines[i][j]
            } else if (buf != '') {               
                if (shouldBeCounted(i, j, lines, buf)) {
                    for (let x = i - 1; x <= i + 1; x++) {
                        if (x < 0 || x > lines.length) {
                            continue
                        }
    
                        for (let y = j - (buf.length + 1); y <= j; y++) {
                            if (!isInBounds(x,  y, lines)) {
                                continue
                            }
    
                            if (lines[x][y] == '*') {
                                if (gearNeighbors[`${x},${y}`] === undefined) {
                                    gearNeighbors[`${x},${y}`] = [parseInt(buf)]
                                } else {
                                    gearNeighbors[`${x},${y}`].push(parseInt(buf))
                                }
                            }
                        }
                    }
                }

                buf = ''
            }
        }
    } 

    return Object.values(gearNeighbors)
        .filter((v) => v.length == 2)
        .map((v) => v[0] * v[1])
        .reduce((acc, v) => acc + v, 0)

}

const partOne = (lines) => {
    lines = lines.map(l => `.${l}.`)
    
    let sum = 0

    let buf = ''
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (isDigit(lines[i][j])) {
                buf += lines[i][j]
            } else if (buf != '') {
                if (shouldBeCounted(i, j, lines, buf)) {
                    sum += parseInt(buf)
                }
                buf = ''
            }
        }
    } 

    return sum
}

const main = () => {
    const lines = fs.readFileSync('./input.txt').toString().split('\n')
    
    console.log(partOne([...lines]))
    console.log(partTwo([...lines]))
}

main()