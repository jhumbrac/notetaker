const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const app = express();



app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/api/notes", (req, res)=>{
    fs.readFile("db/db.json", "utf8", (err, jsonString)=>{
        if (err) throw err;
        res.json(JSON.parse(jsonString));
    });
});
app.post("/api/notes", (req,res)=>{
    fs.readFile("db/db.json", "utf8", (err, jsonString)=>{
        if (err) throw err;
        let json = JSON.parse(jsonString);
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
app.use(express.static(__dirname + '/'));
app.listen(PORT, function(){
    console.log(`Server is listening on port: ${PORT}`);
});