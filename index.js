const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files:files});
    })
})

app.get('/file/:filename', function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
    })
})

app.get('/edit/:filename', function(req,res){
    res.render('edit', {filename: req.params.filename});
})

app.post('/edit', function(req, res){
    const previousname = `./files/${req.body.previous}`;
    const newname = `./files/${req.body.new}`;
    //passed the values below :-

    fs.rename(previousname, newname, function(err){
        if (err) {
            console.error('Error renaming to file', err);
            res.status(500).send('An error occurred while renaming this file');
        } else {
            res.redirect('/');
        }
    })
})
app.post('/create', function(req, res){ 
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,  req.body.details, function(err) {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('An error occurred while writing the file');
        } else {
            res.redirect('/');
        }
    });
})

app.listen(3000);