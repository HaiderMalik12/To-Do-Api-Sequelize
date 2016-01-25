var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var PORT=process.env.PORT || 3000;
var db=require('./db.js');
var _=require('underscore');
var todoNextId=1;

app.use(bodyParser.json());

app.get('/',function(req,res){

res.send('Hello Express');
});

app.post('/todos',function(req,res){
 
 var body=_.pick(req.body,'description','completed');
  db.todo.create(body).then(function(todo){
  	res.json(todo.toJSON());
  },function(e){
    res.status(400).json(e);
  });
body.id=todoNextId++;
res.json(body);
});

//GET todos/:id
app.get('/todos/:id',function(req,res){
	var id=parseInt(req.params.id);
    
     db.todo.findById(id).then(function(todo){ 
     	//truthy
     	if(!!todo){

     	res.json(todo.toJSON());
     	}else{
     		res.status(404).json(err);
     	}
     },function(err){
       res.status(500).send();
     });

});



db.sequelize.sync().then(function(){
app.listen(PORT,function(){
 
 console.log('Express is listening On Port '+PORT);
});

});