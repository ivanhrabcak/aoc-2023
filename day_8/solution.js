const fs = require('fs')

const lookupNode = (name, nodes) =>
    nodes.find(k => k.name == name)

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

const partOne = (instructions, nodes) => {
    let i = 0
    let steps = 0

    let node = lookupNode('AAA', nodes)
    while (node.name !== 'ZZZ') {
        const instruction = instructions[i]

        if (instruction == 'R') {
            node = lookupNode(node.right, nodes)
        } else {
            node = lookupNode(node.left, nodes)
        }

        steps++
        i++

        if (i >= instructions.length) {
            i = 0
        }
    }

    return steps
}

const partTwo = (instructions, nodes) => {
    let i = 0
    
    let myNodes = nodes.filter(k => k.name[2] == 'A')

    let steps = myNodes.map(startingNode => {
        let node = startingNode
        let steps = 0
        while (node.name[2] !== 'Z') {
    
            const instruction = instructions[i]
    
            if (instruction == 'R') {
                node = lookupNode(node.right, nodes)
            } else {
                node = lookupNode(node.left, nodes)
            }
    
            steps++
            i++
    
            if (i >= instructions.length) {
                i = 0
            }
        }

        return steps
    })

    return steps.reduce(lcm)
}

const main = () => {
    const [instructions, rawNodes] = fs.readFileSync('./input.txt').toString().split('\n\n')
    const nodes = rawNodes.split('\n')
        .map(nodeLine => nodeLine.replace('(', '').replace(')', '')
            .split(' = ')
            .map((t, i, arr) => {
                if (i % 2 === 1) {
                    const nodeName = arr[i - 1]
                    const [left, right] = t.split(', ')

                    return {name: nodeName, left, right}
                }
            })
            .filter(k => k !== undefined)
        )
        .map(l => l[0])
    
    console.log(partOne(instructions, nodes))
    console.log(partTwo(instructions, nodes))
    
}

main()