const fs = require('fs')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'keins',
    database: 'serien_solr_import'
})

connection.connect()

connection.query(`
    SELECT 
        SeriesName,
        Status,
        FirstAired,
        Network,  
        Genre,
        Actors,
        Overview,
        hits
    FROM serien_solr_import.tvseries 
    -- LIMIT 100`, 
    (error, rows) => {
        if (error) throw error;
        console.log(`Found ${rows.length} rows.`)

        rows.forEach((item) => {
            if (item.Genre) {
                item.Genre = item.Genre.split('|').filter(genre => genre.length > 0)
            }
            if (item.Actors) {
                item.Actors = item.Actors.split('|').filter(actor => actor.length > 0)
            }
        })

        fs.writeFile('./series.json', JSON.stringify(rows), (err) => {
            if (err) throw err;
            console.log(`Saved to series.json!`)
        })

        connection.end()
    }
);