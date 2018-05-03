const fs = require('fs')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const index = {}
const resourceDir = 'test'

const files = fs.readdirSync(resourceDir)

files.forEach(file => {
    fs.readFileSync(`${resourceDir}/${file}`, 'utf8').split(/[\s\n]+/).forEach(term => {
        if (term.length <= 1) return 0; // skip short terms
        
        if (!index[term]) {
            index[term] = {
                docs: {},
                idf: 0
            }
        } 
        
        index[term].docs[file] = 
            index[term].docs[file] ? 
                index[term].docs[file] + 1
                : 1
    })
})

const documentFrequency = term => Object.keys(index[term].docs).length 
const inverseDocumentFrequency = term => files.length / documentFrequency(term)

function calcIDF() {
    for ([term, info] of Object.entries(index)) {
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
        //console.log('Found x results, showing top 5')
        const scores = []

        input.split(/\s+/).forEach(queryTerm => {
            if (!index[queryTerm]) return 0;

            for (let document in index[queryTerm].docs) {
                let documentScore = scores.find(item => item.document === document)

                if (!documentScore) {
                    documentScore = {
                        document,
                        score: 0
                    }
                    scores.push(documentScore)
                }
                documentScore.score += index[queryTerm].docs[document] * index[queryTerm].idf
            }
        })

        console.log(scores)

        askForInput()
    })
}
