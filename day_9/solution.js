const fs = require('fs')

const getSequenceDiffs = (sequence) => {
    let sequences = [sequence]
    while (sequences[sequences.length - 1].filter(k => k !== 0).length !== 0) {
        sequences.push(sequences[sequences.length - 1].map((k, i, arr) => {
            if (i === 0) {
                return
            }

            return k - arr[i - 1]
        }).slice(1))
    }

    return sequences
}

const getNextValue = (sequence) => {
    let sequences = getSequenceDiffs(sequence)

    sequences[sequences.length - 1].push(0)
    for (let i = sequences.length - 2; i >= 0; i--) {
        const seq = sequences[i]
        const prevSeq = sequences[i + 1]

        const diff = prevSeq[prevSeq.length - 1]
        seq.push(seq[seq.length - 1] + diff)
    }

    const extendedSequence = sequences[0]
    return extendedSequence[extendedSequence.length - 1]
}

const getPreviousValue = (sequence) => {
    let sequences = getSequenceDiffs(sequence)

    const lastSequence = sequences[sequences.length - 1]
    sequences[sequences.length - 1] = [0, ...lastSequence]
    for (let i = sequences.length - 2; i >= 0; i--) {
        const seq = sequences[i]
        const prevSeq = sequences[i + 1]

        const diff = prevSeq[0]
        sequences[i] = [seq[0] - diff, ...seq]
    }

    const extendedSequence = sequences[0]
    return extendedSequence[0]
}

const partOne = (histories) => {
    return histories.map(h => getNextValue(h)).reduce((acc, k) => acc + k, 0)
}

const partTwo = (histories) => {
    return histories.map(h => getPreviousValue(h)).reduce((acc, k) => acc + k, 0)
}

const main = () => {
    const lines = fs.readFileSync('./input.txt').toString().split('\n')

    const histories = lines.map(l => l.split(' ').map(k => parseInt(k)).filter(k => !isNaN(k)))

    console.log(partOne(histories))
    console.log(partTwo(histories))
}

main()