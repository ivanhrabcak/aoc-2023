const fs = require('fs')

const isValidPartitial = (sPartitial, grouping, targetLength) => {
    let groups = []
    for (let i = 0; i < sPartitial.length; i++) {
        const current = sPartitial[i]
        if (i === 0) {
            if (current === '#') {
                groups.push('#')
            }

            continue
        }

        const previous = sPartitial[i - 1]
        if (previous === '#' && current === '#') {
            groups[groups.length] = groups[groups.length] + '#'
        } else if (current === '#' && previous === '.') {
            groups.push('#')
        }

        console.log(groups)
    }
}

const main = () => {
    const lines = fs.readFileSync('./input.txt').toString().split('\n')

}

main()