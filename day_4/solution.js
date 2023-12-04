const fs = require('fs')

const partOne = (cards) =>
    cards.map(([winningNumbers, myNumbers]) => winningNumbers.reduce(
        (acc, n) => ({
            sum: myNumbers.includes(n) ? acc.pointWorth : acc.sum,
            pointWorth: myNumbers.includes(n) ? acc.pointWorth * 2 : acc.pointWorth
        }), {sum: 0, pointWorth: 1})
    ).map(k => k.sum).reduce((acc, k) => acc + k, 0)

const partTwo = (cards) => {
    const winnings = cards.map(c => partOne([c]))
        .map(w => w === 0 ? 0 : Math.log2(w) + 1)
    const nOfCards = cards.map(_ => 1)

    winnings.forEach(
        (w, i) => new Array(w)
            .fill(0)
            .map((_, k) => nOfCards[i + k + 1] += nOfCards[i])
    )

    return nOfCards.reduce((acc, k) => acc + k, 0)
}

const main = () => {
    const lines = fs.readFileSync('./input.txt').toString().split('\n')

    const cards = lines.map(
        line => line.split(':')[1]
            .split(' |')
            .map(p => p.split(' ').splice(1).map(i => parseInt(i)).filter(k => !isNaN(k)))
    )
    
    console.log(partOne(cards))
    console.log(partTwo(cards))
}

main()