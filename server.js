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
});

//GET todos/:id
app.get('/todos/:id',function(req,res){
	var id=parseInt(req.params.id);
    
     db.todo.findById(id).then(function(todo){ 
     	//truthy
     	if(!!todo){

     	res.json(todo.toJSON());
     	}else{
     		res.status(404).send();
     	}
     },function(err){
       res.status(500).send();
     });

});

//GET todos/?q=
//Get todos/?completed=false
app.get('/todos',function(req,res){
   var query=req.query;
   var where={};
   if(query.hasOwnProperty('completed') && query.completed==='true'){
   	where.completed=true;
   }
   else if(query.hasOwnProperty('completed') && query.completed==='false'){
   	where.completed=false;
   }
   if(query.hasOwnProperty('q') && query.q.length>0){
   	where.description={
   		$like:'%' +query.q+ '%'
   	};
   } 
   
   db.todo.findAll({where:where}).then(function(todos){
   	res.json(todos);
   })
},function(e){
	res.status(500).send();
});

// DELETE/:id
app.delete('/todos/:id',function(req,res){
 var todoId=parseInt(req.params.id);

  db.todo.destroy({
    where:{
      id:todoId
    }
  }).then(function(rowsDeleted){
    if(rowsDeleted === 0){
      res.status(404).json({
        error:'No todo with Id'
      });
    }else{
      //everything is ok no return
      res.status(204).send();
    }
  },function(err){
    res.status(500).send();
  });
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }

  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
      todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
      }, function(e) {
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  });
});

// POST/users
app.post('/users',function(req,res){
  var body=_.pick(req.body,'email','password');
  db.user.create(body).then(function(user){
   if(user)
   {
    res.json(user);
   }
  },function(err){
  res.status(400).json(err);
  });


});
db.sequelize.sync().then(function(){
app.listen(PORT,function(){
 
 console.log('Express is listening On Port '+PORT);
});

});
