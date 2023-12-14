const fs = require('fs')

const findHorizontalMirrorImageIndex = (pattern, targetMistakes) => {
    for (let i = 0; i < pattern.length; i++) {
        let l = i + 1

        if (l >= pattern.length) {
            continue
        }

        let k = i;
        let mistakes = 0
        while (k >= 0 && l < pattern.length) {
            mistakes += countMistakes(pattern[l], pattern[k])

            if (mistakes > targetMistakes) {
                break
            }

            l++
            k--
        }

        if (mistakes == targetMistakes) {
            return i
        }
    }
}

const findVerticalMirrorImageIndex = (pattern, targetMistakes) => {
    let flippedPattern = new Array(pattern[0].length).fill('')
    for (let j = 0; j < pattern[0].length; j++) {
        for (let i = 0; i < pattern.length; i++) {
            flippedPattern[j] += pattern[i][j]
        }
    }

    return findHorizontalMirrorImageIndex(flippedPattern, targetMistakes)
}

const countMistakes = (l1, l2) => {
    let mistakes = 0
    for (let i = 0; i < l1.length; i++) {
        if (l1[i] != l2[i]) {
            mistakes++
        }
    }

    return mistakes
}

const partOne = (patterns) => {
    return patterns.map(pattern => {
        const horizontal = findHorizontalMirrorImageIndex(pattern, 0)// * 100
        
        if (horizontal == undefined) {
            return findVerticalMirrorImageIndex(pattern, 0) + 1
        }

        return (horizontal + 1) * 100
    }).reduce((acc, k) => acc + k, 0)
}

const partTwo = (patterns) => {
    return patterns.map(pattern => {
        const originalHorizontal = findHorizontalMirrorImageIndex(pattern, 1)
        const originalVertical = findVerticalMirrorImageIndex(pattern, 1)

        if (originalHorizontal === undefined) {
            return originalVertical + 1
        }

        return (originalHorizontal + 1) * 100
    }).reduce((acc, k) => acc + k, 0)
}

const main = () => {
    const patterns = fs.readFileSync('./input.txt').toString().split('\n\n').map(p => p.split('\n'))

    console.log(partOne(patterns))
    console.log(partTwo(patterns))
}

main()