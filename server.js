const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});
app.get("/api/notes", (req, res)=>{
    fs.readFile("db/db.json", (err, data) =>{
        if (err) throw err;
        let json = JSON.parse(data);
        res.send(json);
    });
});
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/api/notes", (req,res)=>{
    fs.readFile("db/db.json", (err, data)=>{
        if (err) throw err;
        let json = JSON.parse(data);
        let newNote = {
            title: req.body.title,
            text: req.body.text
        };
        json.push(newNote);
        fs.writeFile('db/db.json', JSON.stringify(json), err=>{
            if (err) throw err;
            res.send(`New note: ${newNote}`);
        });
    });
});
app.delete('/api/notes/:title', (req, res)=>{
    fs.readFile('db/db.json', 'utf8', (err, jsonString)=>{
        if (err) throw err;
        let deleteNote = req.params.title;
        let json = JSON.parse(jsonString);
        let jsonDelete = json.filter(item => item.title !== deleteNote);
        fs.writeFile('db/db.json', JSON.stringify(jsonDelete), err=>{
            if (err) throw err;
            res.send('Note Deleted.');
        });
    });
});

app.listen(PORT, function(){
    console.log(`Server is listening on port: ${PORT}`);
});