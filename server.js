const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const DATABASE = require('./Develop/db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('./Develop/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'./index.html'))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './notes.html'));
});

app.get("/api/notes", async function (req, res){
    fs.readFile("./Develop/db/db.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            return res.json(JSON.parse(data));
        }
    })
})

app.post("/api/notes", async function (req, res){
    console.log(req.method);

    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        }
        const response = {
            status: "Successfully created a new note",
            body: newNote,
        }
        console.log(response);
        res.status(201).json(response);
        fs.readFile("./Develop/db/db.json", (err, data) => {
            if (err) {
                console.error(err);
            } else {
                arr = JSON.parse(data);
                arr.push(response.body);
                fs.writeFile("./Develop/db/db.json", JSON.stringify(arr), err => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("File content changed");
                    }
                })
            }
        })
    } else {
        res.status(400).json("Error with the note, please try again");
    }
    console.log("Posting to api/notes")
});

app.delete("/api/notes/:id", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    notes = notes.filter(selected =>{
        return selected.id != noteId;
    })

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(notes));
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`Starting server on http://localhost:${PORT}`);
});