const fs = require('fs')

const tilt = ([tx, ty], field) => {
    const tiltedField = [...field].map(l => [...l])
    let movements = -1
    while (movements != 0) {
        movements = 0
        for (let x = 0; x < field.length; x++) {
            for (let y = 0; y < field.length; y++) {
                if (x + tx >= field.length || x + tx < 0 || y + ty >= field[0].length || y + ty < 0) {
                    continue
                }
    
                const object = tiltedField[x][y]
                const obstacle = tiltedField[x + tx][y + ty]
    
                if (object == 'O' && obstacle == '.') {
                    tiltedField[x][y] = '.'
                    tiltedField[x + tx][y + ty] = 'O'
                    movements++
                }
            }
        }
    }

    return tiltedField
}

const calculateLoad = (field) => {
    let sum = 0
    for (let i = 0; i < field.length; i++) {
        const load = field.length - i
        for (let y = 0; y < field[0].length; y++) {
            if (field[i][y] == 'O') {
                sum += load
            }
        }
    }

    return sum
}

const partOne = (field) => {
    const tiltedField = tilt([-1, 0], field)
    
    return calculateLoad(tiltedField)
}

const partTwo = (field) => {
    for (let i = 0; i < 1000; i++) {
        const cycle = [[-1, 0], [0, -1], [1, 0], [0, 1]]
    
        for (let t of cycle) {
            field = tilt(t, field)
        }
    }

    return calculateLoad(field)
}

const main = () => {
    const field = fs.readFileSync('./input.txt').toString().split('\n').map(l => [...l])

    console.log(partOne(field))
    console.log(partTwo(field))
}

main()