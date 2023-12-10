const fs = require('fs')

const getConnectedIndices = (pipe) => {
    if (pipe == '|') {
        return [[-1, 0], [1, 0]]
    } else if (pipe == '-') {
        return [[0, -1], [0, 1]]
    } else if (pipe == 'L') {
        return [[-1, 0], [0, 1]]
    } else if (pipe == 'J') {
        return [[-1, 0], [0, -1]]
    } else if (pipe == '7') {
        return [[0, -1], [1, 0]]
    } else if (pipe == 'F') {
        return [[0, 1], [1, 0]]
    }
}

const getConnectedPositions = (pipe, x, y) => {
    const connectedIndices = getConnectedIndices(pipe)
    return connectedIndices.map(([dx, dy]) => [x + dx, y + dy])
}

const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

const arrayIncludesArray = (inner, array) => {
    return array.some(k => arraysEqual(inner, k))
}

const reverse = ([dx, dy]) => {
    return [-dx, -dy]
}

const pipeTypes = '|-LJ7F'
const findStartingPiece = (pipes) => {
    const startX = pipes.findIndex(k => k.includes('S'))
    const startY = pipes[startX].findIndex(k => k == 'S')

    return {
        startingPiece: [...pipeTypes].filter(p => {
            let connectedIndices = getConnectedPositions(p, startX, startY)
            
            return connectedIndices.filter(([x, y]) => {
                if (x < 0 || x >= pipes.length || y < 0 || y >= pipes[0].length) {
                    return false
                }

                const pipe = pipes[x][y]
                if (pipe == '.') {
                    return false
                }

                const pipeConnectedIndices = getConnectedPositions(pipe, x, y)
                
                return arrayIncludesArray([startX, startY], pipeConnectedIndices)
            }).length === 2
        })[0],
        startX, startY
    }
}

const getLoopNodes = (pipes) => {
    const {startingPiece, startX, startY} = findStartingPiece(pipes)
    const visitedNodes = []

    let x = startX
    let y = startY
    while (true) {
        const pipe = pipes[x][y] === 'S' ? startingPiece : pipes[x][y]
        const neighbors = getConnectedPositions(pipe, x, y)
        visitedNodes.push(`${x}-${y}`)
        if (neighbors.filter(([x, y]) => visitedNodes.includes(`${x}-${y}`)).length === 2) {
            break
        }

        const [newX, newY] = neighbors.filter(([nx, ny]) => !visitedNodes.includes(`${nx}-${ny}`))[0]
        x = newX
        y = newY
    }

    return visitedNodes
}

const partOne = (pipes) => {
    return Math.round(getLoopNodes(pipes).length / 2)
}

const partTwo = (pipes) => {
    const {startingPiece, startX, startY} = findStartingPiece(pipes)
    const loopNodes = getLoopNodes(pipes)

    pipes[startX][startY] = startingPiece

    return pipes.flatMap((r, x) => r.map((v, y) => loopNodes.includes(`${x}-${y}`) ? undefined : [x, y]))
        .filter(k => k !== undefined)
        .filter(([x, y]) => {          
            const loopPipesToLeft = new Array(y).fill(0)
                .map((_, i) => [x, y - (i + 1)])
                .filter(([px, py]) => 
                    '|JL'.includes(pipes[px][py]) && loopNodes.includes(`${px}-${py}`)
                )

            return loopPipesToLeft.length % 2 == 1
        }).length
}

const main = () => {
    const input = fs.readFileSync('./input.txt').toString().split('\n')
        .map(l => [...l])

    console.log(partOne(input))
    console.log(partTwo(input))
}

main()