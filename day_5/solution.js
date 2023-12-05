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

const intervalDifference = (interval1, interval2) => {
    const result = [];

    if (interval1[1] < interval2[0] || interval2[1] < interval1[0]) {
        return [interval1, interval2];
    }

    if (interval1[0] < interval2[0]) {
        result.push([interval1[0], interval2[0] - 1]);
    }

    if (interval1[1] > interval2[1]) {
        result.push([interval2[1] + 1, interval1[1]]);
    }

    return result;
}

const mergeIntervals = (intervals) => {
    intervals.sort((a, b) => a[0] - b[0])
    let result = [[intervals[0][0], intervals[0][1]]]
    
    intervals.forEach((interval, i, arr) => {
        if (interval[0] <= result[result.length - 1][1] + 1) {
            result[result.length - 1][1] = Math.max(result[result.length - 1][1], interval[1])
        } else {
            result.push(interval)
        }
    })

    return result
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
            return mergeIntervals(
                acc.flatMap((seedRange) => {
                    const intersectionResult = conversion.ranges
                        .map(([_, srcStart, size], i) => [[srcStart, srcStart + size], i])
                        .map(([interval, i]) => [intervalIntersection(seedRange, interval), i])
                        .filter(([interval, _]) => interval !== null)
                    
                    if (intersectionResult.length != 0) {
                        const [intersection, rangeIndex] = intersectionResult[0]

                        const [destStart, srcStart, size] = conversion.ranges[rangeIndex]
                        const rangeStart = (intersection[0] - srcStart) + destStart
                        const rangeEnd = (intersection[1] - srcStart) + destStart

                        const unmatchedRange = intervalDifference(seedRange, intersection)
                        return [[rangeStart, rangeEnd], ...unmatchedRange]
                    } else {
                        return [seedRange]
                    }
                })
            )
        }, seeds.map((s, i, arr) => i % 2 == 1 ? [arr[i - 1], s] : [])
            .filter(k => k.length !== 0)
            .map(([start, size]) => [start, start + size])
        )
        .map(interval => interval[0])
    )
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