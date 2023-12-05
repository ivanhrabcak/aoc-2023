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
    const partitionedSeeds = seeds.map((s, i, arr) => i % 2 == 1 ? [arr[i - 1], s] : [])
            .filter(k => k.length !== 0)
            .map(([start, size]) => [start, start + size])

    let minimum = Infinity
    for (let i = 0; i < partitionedSeeds.length; i++) {
        for (let k = partitionedSeeds[i][0]; k <= partitionedSeeds[i][0] + partitionedSeeds[i][1]; k++) {
            const potentiallyNewMinimum = partOne([k], conversions)
            if (potentiallyNewMinimum < minimum) {
                minimum = potentiallyNewMinimum
                console.log(`Found new minimum: ${minimum}`)
            }
        }
        console.log(`${i}/${partitionedSeeds.length}`)
    }

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