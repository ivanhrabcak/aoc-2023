const fs = require('fs')

const countCards = (hand) => 
    [...hand].reduce((acc, k) => {
        if (acc[k] !== undefined) {
            acc[k] += 1
        } else {
            acc[k] = 1
        }

        return acc
    }, {})

const compareArrays = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const calculatePoints = (rawCardCounts) => {
    if (rawCardCounts.length == 1) {
        // five of a kind
        return 7
    } else if (compareArrays(rawCardCounts, [1, 4]) || compareArrays(rawCardCounts, [4, 1])) {
        // four of a kind
        return 6
    } else if (compareArrays(rawCardCounts, [3, 2]) || compareArrays(rawCardCounts, [2, 3])) {
        // full house
        return 5
    } else if (rawCardCounts.includes(3)) {
        // three of a kind
        return 4
    } else if (rawCardCounts.indexOf(2) !== -1) {
        const firstPair = rawCardCounts.indexOf(2)
        if (rawCardCounts.indexOf(2, firstPair + 1) !== -1) {
            // two pair
            return 3
        } else {
            // one pair
            return 2
        }
    } else {
        // high card
        return 1
    }
}

const getHandValue = (hand) => {
    let cardCounts = countCards(hand)

    if (hand.includes('J')) {
        const cardsByFrequency = Object.entries(cardCounts).filter(([k, v]) => k !== 'J').sort(([c1, a], [c2, b]) => b - a)
        
        // JJJJJ
        if (cardsByFrequency.length == 0) {
            return calculatePoints([5])
        }

        const mostFrequentCard = cardsByFrequency[0][0]

        cardCounts = Object.entries(cardCounts).reduce((acc, [k, v]) => {
            if (k === 'J') {
                return acc
            }

            if (k === mostFrequentCard) {
                acc[k] = v + cardCounts['J']
                return acc
            }

            acc[k] = v
            return acc
        }, {})
    }

    return calculatePoints(Object.values(cardCounts))
}

const partOne = (bids) => {
    return bids.sort(([hand, bid], [otherHand, otherBid]) => {
        const handRawCardCounts = Object.values(countCards(hand))
        const handValue = calculatePoints(handRawCardCounts)

        const otherHandRawCardCounts = Object.values(countCards(otherHand))
        const otherHandValue = calculatePoints(otherHandRawCardCounts)

        if (handValue !== otherHandValue) {
            return handValue - otherHandValue
        }

        let cardValues = [...'23456789TJQKA']
        for (let i = 0; i < hand.length; i++) {
            const cardValue = cardValues.indexOf(hand[i])
            const otherCardValue = cardValues.indexOf(otherHand[i])

            if (otherCardValue != cardValue) {
                return cardValue - otherCardValue   
            }
        }

        return 0
    }).map(([_, bid], i) => bid * (i + 1)).reduce((acc, k) => k + acc, 0)
}

const partTwo = (bids) => {
    return bids.sort(([hand, bid], [otherHand, otherBid]) => {
        const handValue = getHandValue(hand)
        const otherHandValue = getHandValue(otherHand)

        if (handValue !== otherHandValue) {
            return handValue - otherHandValue
        }

        let cardValues = [...'J23456789TQKA']
        for (let i = 0; i < hand.length; i++) {
            const cardValue = cardValues.indexOf(hand[i])
            const otherCardValue = cardValues.indexOf(otherHand[i])

            if (otherCardValue != cardValue) {
                return cardValue - otherCardValue   
            }
        }

        return 0
    }).map(([_, bid], i) => bid * (i + 1)).reduce((acc, k) => k + acc, 0)
} 

const main = () => {
    const lines = fs.readFileSync('./input.txt').toString().split('\n')

    const bids = lines.map(l => l.split(' ').slice(0, 2).map((k, i) => i === 1 ? parseInt(k) : k))

    console.log(partOne(bids))
    console.log(partTwo(bids))
}

main()