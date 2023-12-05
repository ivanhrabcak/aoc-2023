const fs = require('fs')

const intervalIntersection = (a, b) => {
    const min = a[0] < b[0] ? a : b
    const max = min == a ? b : a

    if (min[1] < max[0]) {
        return null
    }

    return [
        max[0], 
        min[1] < max[1] ? min[1] : max[1]
    ]
}

const partOne = (seeds, conversions) => {
    return Math.min(
        ...conversions.reduce((acc, conversion) => {
            return acc.map((seed) => {
                
                const intersectionResult = conversion.ranges
                    .map(([_, srcStart, size], i) => [[srcStart, srcStart + size], i])
                    .map(([interval, i]) => [intervalIntersection([seed, seed], interval), i])
                    .filter(([interval, _]) => interval !== null)
                
                if (intersectionResult.length != 0) {
                    const [_, rangeIndex] = intersectionResult[0]

                    const [destStart, srcStart, size] = conversion.ranges[rangeIndex]
                    return (seed - srcStart) + destStart
                } else {
                    return seed
                }
            })
        }, seeds)
    )
}

const partTwo = (seeds, conversions) => {
    return Math.min(
        ...conversions.reduce((acc, conversion) => {
            return acc.map((seedRange) => {
                const intersectionResult = conversion.ranges
                    .map(([_, srcStart, size], i) => [[srcStart, srcStart + size], i])
                    .map(([interval, i]) => [intervalIntersection(seedRange, interval), i])
                    .filter(([interval, _]) => interval !== null)
                
                if (intersectionResult.length != 0) {
                    const [_, rangeIndex] = intersectionResult[0]

                    const [destStart, srcStart, size] = conversion.ranges[rangeIndex]
                    return (seed - srcStart) + destStart
                } else {
                    return seed
                }
            })
        }, seeds)
    )
}

const main = () => {
    const input = fs.readFileSync('C:\\Users\\ivanh\\Repositories\\aoc-2023\\day_5\\input.txt').toString()
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
}

main()