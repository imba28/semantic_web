const fs = require('fs')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const index = new Map()
const [resourceDir = 'test', maxResultCount = 5] = process.argv.slice(2)

console.time("timer")

const files = fs.readdirSync(resourceDir)
files.forEach(file => {
    fs.readFileSync(`${resourceDir}/${file}`, 'utf8').split(/[\s\n]+/).forEach(term => {
        term = term.toLowerCase().replace(/[^\w]/, '')
        if (term.length <= 1) return 0 // skip short terms
        
        if (!index.has(term)) {
            index.set(term, {
                docs: {},
                idf: 0
            })
        } 

        const indexEntry = index.get(term)
        if (indexEntry.docs[file]) {
            indexEntry.docs[file]++
        } else {
            indexEntry.docs[file] = 1
        }
    })
})

console.timeEnd("timer")

const documentFrequency = term => Object.keys(index.get(term).docs).length 
const inverseDocumentFrequency = term => files.length / documentFrequency(term)

function calcIDF() {
    for ([term, info] of index.entries()) {
        info.idf = files.length / documentFrequency(term)
    }
}

calcIDF()
askForInput()

function askForInput() {
    rl.question('Enter query, empty to quit: ', input => {
        if (input.length == 0) {
            console.log('Goodbye!')
            process.exit(0)
        }

        const scores = []

        input.split(/\s+/).forEach(queryTerm => {
            if (!index.get(queryTerm)) return 0

            for (let document in index.get(queryTerm).docs) {
                let documentScore = scores.find(item => item.document === document)

                if (!documentScore) {
                    documentScore = {
                        partial: [],
                        document,
                        score: 0
                    }
                    scores.push(documentScore)
                }

                const partialScore = index.get(queryTerm).docs[document] * index.get(queryTerm).idf
                documentScore.partial.push({
                    term: queryTerm,
                    score: partialScore
                })
                documentScore.score += partialScore
            }
        })

        scores.sort((a, b) => a.score > b.score ? -1 : 1)

        console.log(`Found ${scores.length} results, showing top ${maxResultCount}\n`)
        scores.slice(0, maxResultCount).forEach(item => {
            console.log(`${item.document}: ${item.score}`)
            item.partial.forEach(term => console.log(`${term.term}: ${term.score}`))
            console.log()
        })
        
        askForInput()
    })
}
