const fs = require('fs')

const findConversion = (from, conversions) => conversions.find(k => k.from == from)
const couldRangeBeUsed = (x, start, size) => x >= start && x <= start + size 
const convert = (x, range) => range[0] + (x - range[1])

const partOne = (seeds, conversions) => {
    let currentUnit = 'seed';

    let currentValues = [...seeds]

    while (currentUnit != 'location') {
        const conversion = findConversion(currentUnit, conversions)
        const conversionRanges = conversion.ranges

        currentValues = currentValues.map(currentValue => {
            const conversionRange = conversionRanges.find(r => couldRangeBeUsed(currentValue, r[1], r[2]))

            if (conversionRange === undefined) {
                return currentValue
            }

            return convert(currentValue, conversionRange)
        })

        currentUnit = conversion.to
    }

    return Math.min(...currentValues)
}

const partTwo = (seeds, conversions) => {
    const seedPairs = seeds.map((seed, i, allSeeds) => i % 2 == 1 ? [allSeeds[i - 1], seed] : null)
        .filter(k => k != null)

    const allSeeds = seedPairs.flatMap(([start, size]) => new Array(size).fill(0).map((_, i) => start + i))

    return partOne(allSeeds, conversions)
}

const main = () => {
    const input = fs.readFileSync('./input.txt').toString()    
    const [seedList, ...conversionMaps] = input.split('\n\n')

    const seeds = seedList.split(': ')[1]
        .split(' ')
        .map(x => parseInt(x))
    
    const conversions = conversionMaps.map(conversion => {
        const [conversionName, ...rawRanges] = conversion.split('\n')

        const [from, _, to] = conversionName.split(' ')[0].split('-')
        const ranges = rawRanges.map(r => r.split(' ').map(k => parseInt(k)))

        return {from, to, ranges}
    })

    console.log(partOne(seeds, conversions))
    console.log(partTwo(seeds, conversions))
}

main()