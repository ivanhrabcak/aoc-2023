const fs = require('fs')

const findConversion = (from, conversions) => conversions.find(k => k.from == from)
const couldRangeBeUsed = (x, start, size) => x >= start && x <= start + size 
const convert = (x, range) => range[0] + (x - range[1])

const partOne = (seeds, conversions) => {
    let currentUnit = 'seed';

    let currentValues = seeds

    while (currentUnit != 'location') {
        // console.log(currentUnit)
        const conversion = findConversion(currentUnit, conversions)
        const conversionRanges = conversion.ranges

        for (let i = 0; i < currentValues.length; i++) {
            const conversionRange = conversionRanges.find(r => couldRangeBeUsed(currentValues[i], r[1], r[2]))

            if (conversionRange === undefined) {
                continue
            }

            currentValues[i] = convert(currentValues[i], conversionRange)
        }
        // currentValues = currentValues.map(currentValue => {
        //     const conversionRange = conversionRanges.find(r => couldRangeBeUsed(currentValue, r[1], r[2]))

        //     if (conversionRange === undefined) {
        //         return currentValue
        //     }

        //     return convert(currentValue, conversionRange)
        // })

        currentUnit = conversion.to
    }

    return Math.min(...currentValues)
}

const partTwo = (seeds, conversions) => {
    let minimum = 9999999999999999999999999999999999999999999999999
    for (let i = 0; i < seeds.length; i += 2) {
        const [start, size] = [seeds[i], seeds[i + 1]]
        for (let j = start; j <= start + size + 800; j += 100) {
            const batch = []
            for (let k = start + j; start + j + 100; k++) {
                if (k > start + size) {
                    break
                }

                batch.push(j)
            }

            if (batch.length == 0) {
                continue
            }

            const potentiallyNewMinimum = partOne(batch, conversions)
            minimum = Math.min(minimum, potentiallyNewMinimum)
            delete batch
        }
        console.log(`${i}/${seeds.length}`)
    }

    // const allSeeds = seedPairs.flatMap(([start, size]) => new Array(size).fill(0).map((_, i) => start + i))
    return minimum
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