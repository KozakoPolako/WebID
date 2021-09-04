var express = require('express');
var app = express();

app.get('/', function(req, res){
    //console.log(req);
    console.log("jołł");
   res.send("Hellos");
});

app.listen(8000);
console.log("działadasdsadwdad");