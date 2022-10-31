const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("./Develop/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});
