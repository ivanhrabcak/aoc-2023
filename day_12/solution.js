const fs = require('fs')

DOT = 0
X = 1
SOMETHING = 3

const isValidPartial = (sPartitial, grouping, targetLength) => {
    let groups = []

    if (sPartitial.length > targetLength) {
        return false
    }


    for (let i = 0; i < sPartitial.length; i++) {
        const current = sPartitial[i]
        if (i === 0) {
            if (current === X) {
                groups.push(1)
            }

            continue
        }

        const previous = sPartitial[i - 1]
        if (previous === X && current === X) {
            groups[groups.length - 1] += 1
        } else if (current === X && previous === DOT) {
            groups.push(1)
        }

        if (current == DOT && previous == X) {
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

const countPossibleArrangements = (template, groups, arrangement = []) => {
    const isValid = isValidPartial(arrangement, groups, template.length)

    if (arrangement.length === template.length) {
        return isValid ? 1 : 0
    } else if (!isValid) {
        return 0
    }

    let sum = 0
    let possibleArrangement = arrangement
    
    let i = arrangement.length
    while (i !== template.length && template[i] !== SOMETHING) {
        possibleArrangement.push(template[i])
        i++
    }

    if (i !== template.length) {
        sum += countPossibleArrangements(template, groups, [...possibleArrangement, DOT])
        sum += countPossibleArrangements(template, groups, [...possibleArrangement, X])

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
const repeatArrangement = (arr) => {
    let result = []
    for (let i = 0; i < 5; i++) {
        if (i != 0) {
            result.push(SOMETHING)
        }

        for (let j = 0; j < arr.length; j++) {
            result.push(arr[j])
        }
    }

    return result
}

const partTwo = (undeterminedArrangements) => {
    undeterminedArrangements = undeterminedArrangements.map(([arr, grouping]) => [
        repeatArrangement(arr), 
        repeat(grouping, 5)
    ])

    return partOne(undeterminedArrangements)
}

const main = () => {
    // ? => 3
    // # => 2
    // . => 1

    const undeterminedArrangements = fs.readFileSync('C:/Users/ivanh/Repositories/aoc-2023/day_12/input.txt').toString().split('\n')
        .map(l => l.split(' '))
        .filter(a => a.length != 1)
        .map(([a, groups]) => [[...a].map(k => k == '?' ? 3 : k == '#' ? 1 : 0), groups.split(',').map(k => parseInt(k))])
    
    console.log(partOne(undeterminedArrangements))
    console.log(partTwo(undeterminedArrangements))
}

main() 