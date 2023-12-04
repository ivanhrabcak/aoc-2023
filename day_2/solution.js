const fs = require('fs')

const orDefault = (x, def) => x ? x : def
const isPossible = (roll, maxAllowed) =>
    roll.red <= maxAllowed.red && 
    roll.green <= maxAllowed.green && 
    roll.blue <= maxAllowed.blue

const partTwo = (maxRollsPerColor) => {      
    return maxRollsPerColor
        .reduce((acc, {max}) => acc + max.red * max.green * max.blue, 0)
}

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
        const max = draws.reduce((acc, draw) => ({
            red: orDefault(Math.max(draw.red, acc.red), acc.red), 
            green: orDefault(Math.max(draw.green, acc.green), acc.green),
            blue: orDefault(Math.max(draw.blue, acc.blue), acc.blue),
        }), {red: 0, green: 0, blue: 0})

        return {gameId, max}
    })

    console.log(partOne(maxRollsPerColor))
    console.log(partTwo(maxRollsPerColor))
}

main()