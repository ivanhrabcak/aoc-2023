const fs = require('fs')

const partTwo = (maxRollsPerColor) => {      
    return maxRollsPerColor
        .reduce((acc, {max}) => acc += max.red * max.green * max.blue, 0)
}

const isPossible = (o, maxAllowed) =>
    o.red <= maxAllowed.red && o.green <= maxAllowed.green && o.blue <= maxAllowed.blue

const partOne = (maxRollsPerColor) => {
    const maxAllowed = {red: 12, green: 13, blue: 14}
    
        
    return maxRollsPerColor
        .filter(({max}) => isPossible(max, maxAllowed))
        .reduce((acc, {gameId}) => acc + gameId, 0)
}

const main = () => {
    const input = fs.readFileSync('input.txt').toString().split('\n')
    
    const games = input.map(gameString => gameString.split(': '))
        .map(
            ([gameNumber, cubeCounts]) => [
                parseInt(gameNumber.replace('Game ', '')), 
                cubeCounts.split('; ')
                    .map(colors => colors.split(', '))
                    .map(draws => 
                        draws.reduce((acc, draw) => {
                            const [count, color] = draw.split(' ')

                            acc[color] = parseInt(count)
                            return acc
                        }, {})
                    )
                    
            ]
        )
    
    const maxRollsPerColor = games.map(([gameId, draws]) => {
        const max = draws.reduce((acc, draw) => {
            if (draw.red > acc.red) {
                acc.red = draw.red
            }

            if (draw.green > acc.green) {
                acc.green = draw.green
            }

            if (draw.blue > acc.blue) {
                acc.blue = draw.blue
            }

            return acc
        }, {red: 0, green: 0, blue: 0})

        return {gameId, max}
    })

    console.log(partOne(maxRollsPerColor))
    console.log(partTwo(maxRollsPerColor))
}

main()