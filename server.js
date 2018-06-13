
var express = require("express");
var app=express();
const flash = require("express-flash");
app.use(flash());
var session = require('express-session');
var mongoose = require('mongoose');

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}))


mongoose.connect('mongodb://localhost/msg_dashboard_db');

var CmtSchema = new mongoose.Schema({
    name:{type: String, required:true},
    cmt:{type:String,required:true},
},{timestamps: true})

var MsgSchema = new mongoose.Schema({
    name:{type: String, required:true},
    msg:{type: String, required:true},
    cmts:[CmtSchema]
},{timestamps: true})



mongoose.model("Cmt",CmtSchema);
mongoose.model("Msg",MsgSchema);
var Msg = mongoose.model("Msg")
var Cmt = mongoose.model("Cmt")


var bodyParser= require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

var path= require("path");

app.use(express.static(path.join(__dirname,"/static")));

app.set('views',path.join(__dirname,'/views'));

app.set('view engine','ejs');



app.get('/r',function(req,res){
    console.log("deleting")
    Msg.remove({},function(done){

        res.redirect('/');
    });
})

app.post('/addCmt',function(req,res){
    var cmt=new Cmt({name:req.body.name,cmt:req.body.cmt});
    Msg.update({id:req.body.id},{$push:{cmts:cmt}},function(err){
        if(err){
            console.log("error adding comment")
        }
        else{
            console.log("comment added");
            res.redirect('/')
        }
    })
})



app.post('/addMsg',function(req,res){
    var msg = new Msg({name:req.body.name,msg:req.body.msg});
    msg.save(function(err){
        if(err){
            console.log("error adding user")
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/');
        }
        else{
            console.log("Mseeage added")
            res.redirect('/');
        }
    })

})






app.get('/',function(req,res){
    Msg.find({},function(err,msgs){
        res.render('index',{msgs:msgs});
    })
    
})

app.listen(5000,function(){
    console.log("listening on port 5000")
})