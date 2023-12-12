const fs = require('fs')

let cache = {}
const isValidPartial = (sPartitial, grouping, targetLength) => {
    let groups = []

    if (sPartitial.length > targetLength) {
        return false
    }


    for (let i = 0; i < sPartitial.length; i++) {
        const current = sPartitial[i]
        if (i === 0) {
            if (current === '#') {
                groups.push(1)
            }

            continue
        }

        const previous = sPartitial[i - 1]
        if (previous === '#' && current === '#') {
            groups[groups.length - 1] += 1
        } else if (current === '#' && previous === '.') {
            groups.push(1)
        }

        if (current == '.' && previous == '#') {
            if (groups.length > grouping.length) {
                return false
            }

            for (let k = 0; k < groups.length; k++) {
                if (k !== groups.length - 1) {
                    if (groups[k] != grouping[k]) {
                        return false
                    }
                } else {
                    if (groups[k] > grouping[k]) {
                        return false
                    }
                }
            }
        }
    }
    
    if (targetLength == sPartitial.length) {
        if (groups.length !== grouping.length) {
            return false
        }

        for (let i = 0; i < groups.length; i++) {
            if (groups[i] != grouping[i]) {
                return false
            }
        }

        return true
    }

    for (let i = 0; i < groups.length; i++) {
        if (i === groups.length - 1) {
            return !(groups[i].length > grouping[i])
        } 
        
        if (groups[i] !== grouping[i]) {
            return false
        }
    }

    return true
}

const countPossibleArrangements = (template, groups, arrangement = '') => {
    const isValid = isValidPartial(arrangement, groups, template.length)

    if (arrangement.length === template.length) {
        return isValid ? 1 : 0
    } else if (!isValid) {
        return 0
    }

    let sum = 0
    let possibleArrangement = arrangement
    
    let i = arrangement.length
    while (i !== template.length && template[i] !== '?') {
        possibleArrangement += template[i]
        i++
    }

    if (i !== template.length) {
        sum += countPossibleArrangements(template, groups, possibleArrangement + '.')
        sum += countPossibleArrangements(template, groups, possibleArrangement + '#')

        return sum
    } 
    
    return countPossibleArrangements(template, groups, possibleArrangement)
}

const partOne = (undeterminedArrangements) => {
    return undeterminedArrangements.reduce((acc, [template, grouping], i, arr) => {
        console.log(`${i}/${arr.length - 1}`)
        cache = {}
        return acc + countPossibleArrangements(template, grouping)
    }, 0)
}

const repeat = (arr, n) => new Array(arr.length * n).fill(0).map((_, i) => arr[i % arr.length])

const partTwo = (undeterminedArrangements) => {
    undeterminedArrangements = undeterminedArrangements.map(([arr, grouping]) => [repeat([arr], 5).join('?'), repeat(grouping, 5)])
    return partOne(undeterminedArrangements)
}

const main = () => {
    const undeterminedArrangements = fs.readFileSync('C:/Users/ivanh/Repositories/aoc-2023/day_12/input.txt').toString().split('\n')
        .map(l => l.split(' '))
        .filter(a => a.length != 1)
        .map(([a, groups]) => [a, groups.split(',').map(k => parseInt(k))])

    console.log(partOne(undeterminedArrangements))
    console.log(partTwo(undeterminedArrangements))
}

main()