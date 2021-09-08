const express = require('express');
const fs = require('fs');
const app = express();
const uuid = require('../utils/uuid');

app.get('/', (req, res) => {
    console.log(`${req.method} existing notes`);

    const dbData = JSON.parse(fs.readFileSync('./db/db.json'));
    res.json(dbData);
});

app.post('/', (req, res) => {
    console.log(`${req.method} note.`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        let dbData = JSON.parse(fs.readFileSync('./db/db.json'));
        dbData.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(dbData, null, 4), (err) => {
            if (err) {
                console.error(err)
            } else {
                console.info('\nData written to db.json')
            }
        });
        res.json(newNote);

    } else {
        res.json('Error in posting to notes')
    }
});


app.delete('/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync('./db/db.json'));

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === req.params.id) {
            data.splice(i, 1);
        };
    };

    fs.writeFile('./db/db.json', JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error(err)
        } else {
            console.info('\ndeleted note')
        }
    });
    res.send('note deleted');
});

module.exports = app;