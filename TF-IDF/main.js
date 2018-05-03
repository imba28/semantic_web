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

filter()

function filter() {
    rl.question('Enter query, empty to quit: ', input => {
        if (input.length == 0) {
            console.log('Goodbye!')
            process.exit(0)
        }
        console.log(`${files.length} documents`)
        console.log('Found x results, showing top 5')

        filter()
    })
}
