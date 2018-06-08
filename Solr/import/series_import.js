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
    LIMIT 100`, 
    (error, results) => {
        if (error) throw error;
        
        console.log(`Found ${results.length} rows.`)
        fs.writeFile('./series.json', JSON.stringify(results), (err) => {
            if (err) throw err;
            console.log(`Saved to series.json!`)
        })

        connection.end()
    }
);