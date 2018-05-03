const fs = require('fs')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const index = new Map()
const resourceDir = 'resource'
const maxResultCount = 5

console.time("p")

const files = fs.readdirSync(resourceDir)
files.forEach(file => {
    fs.readFileSync(`${resourceDir}/${file}`, 'utf8').split(/[\s\n]+/).forEach(term => {
        if (term.length <= 1) return 0; // skip short terms

        term = term.toLowerCase()
        
        if (!index.has(term)) {
            index.set(term, {
                docs: {},
                idf: 0
            })
        } 

        if (index.get(term).docs[file]) {
            index.get(term).docs[file]++
        } else {
            index.get(term).docs[file] = 1
        }
    })
})

console.timeEnd("p")

const documentFrequency = term => Object.keys(index.get(term).docs).length 
const inverseDocumentFrequency = term => files.length / documentFrequency(term)

function calcIDF() {
    for ([term, info] of index.entries()) {
        info.idf = inverseDocumentFrequency(term)
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
            if (!index.get(queryTerm)) return 0;

            for (let document in index.get(queryTerm).docs) {
                let documentScore = scores.find(item => item.document === document)

                if (!documentScore) {
                    documentScore = {
                        document,
                        score: 0
                    }
                    scores.push(documentScore)
                }

                documentScore.score += index.get(queryTerm).docs[document] * index.get(queryTerm).idf
            }
        })

        scores.sort((a, b) => a.score < b.score)
        console.log(scores.slice(0, maxResultCount))

        askForInput()
    })
}
