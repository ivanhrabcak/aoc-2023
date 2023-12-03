const fs = require('fs')

const isDigit = (s) => s.charCodeAt(0) >= '0'.charCodeAt(0) && s.charCodeAt(0) <= '9'.charCodeAt(0)
const isInBounds = (x, y, a) =>
    x < a.length && x >= 0 && y < a[0].length && y >= 0

const partTwo = (lines) => {
    for (let k = 0; k < lines.length; k++) {
        lines[k] = '.' + lines[k] + '.'
    }

    const gearNeighbors = {}

    let buf = ''
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (isDigit(lines[i][j])) {
                buf += lines[i][j]
            } else if (buf != '') {
                let shouldBeCounted = false
                for (let x = i - 1; x <= i + 1; x++) {
                    if (x < 0 || x > lines.length) {
                        continue
                    }

                    if (shouldBeCounted) {
                        break
                    }

                    for (let y = j - (buf.length + 1); y <= j; y++) {
                        if (!isInBounds(x,  y, lines)) {
                            continue
                        }

                        if (lines[x][y] != '.' && !isDigit(lines[x][y])) {
                            shouldBeCounted = true
                            break
                        }
                    }
                }
                
                if (shouldBeCounted) {
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

    return Object.entries(gearNeighbors)
        .filter(([k, v]) => v.length == 2)
        .map(([k, v]) => v[0] * v[1])
        .reduce((acc, v) => acc + v, 0)

}

const partOne = (lines) => {
    for (let k = 0; k < lines.length; k++) {
        lines[k] = '.' + lines[k] + '.'
    }
    
    let sum = 0

    let buf = ''
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[0].length; j++) {
            if (isDigit(lines[i][j])) {
                buf += lines[i][j]
            } else if (buf != '') {
                let shouldBeCounted = false
                for (let x = i - 1; x <= i + 1; x++) {
                    if (x < 0 || x > lines.length) {
                        continue
                    }

                    if (shouldBeCounted) {
                        break
                    }

                    for (let y = j - (buf.length + 1); y <= j; y++) {
                        if (!isInBounds(x,  y, lines)) {
                            continue
                        }

                        if (lines[x][y] != '.' && !isDigit(lines[x][y])) {
                            shouldBeCounted = true
                            break
                        }
                    }
                }
                
                if (shouldBeCounted) {
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