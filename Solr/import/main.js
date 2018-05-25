const fs = require('fs');
const Stream = require('stream');
const readline = require('readline');

const stream = fs.createReadStream('./demo.data');
const outstream = fs.createWriteStream('./demo.json', { flags: 'w' });

const data = [];
const fields = ['opening_txt', 'auxiliary_text', 'title', 'text', 'heading', 'coordinates', 'category', 'outgoing_link', 'popularity_score'];
const map = {
    'opening_txt': 'opening_txt_en',
    'auxiliary_text': 'aux_txt_sort',
    'title': 'title_txt_en',
    'text': 'text_txt_en',
    'heading': 'heading_txt_sort',
    'coordinates': 'location',
    'category': 'category_txt_sort',
    'outgoing_link': 'link_txt_sort',
    'popularity_score': 'popularity_f'
};

const rl = readline.createInterface({
    input: stream,
    output: outstream,
    terminal: false
});

rl.on('line', function (line) {
    const parsedJson = JSON.parse(line);
    if (parsedJson.index) return 0;
    
    const d = {};
    fields.forEach((key) => {
        if (parsedJson[key] !== undefined) {
            const _key = map[key] ? map[key] : key;
            d[_key] = parsedJson[key];
        }
    });
    data.push(d);
});

rl.on('close', () => {
    outstream.write(JSON.stringify(data, null, 2));
});