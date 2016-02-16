//setup
var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

//configuration
mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

//define model
var Todo = mongoose.model('Todo', {
	text: String
});

//routes
//api
//get all todos
app.get('/api/todos', function(req, res){
	//use mongoose to get all todos in database
	Todo.find(function(err, todos){
		if(err)
			res.send(err);
		res.json(todos);
	});
});
//create the todos and send back all todos after creation
app.post('/api/todos', function(req, res){
	//create a todo, information comes from Ajax request from angular
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo){
		if(err)
			res.send(err);

		//get and return all the todos after you create another
		Todo.find(function(err, todos){
			if(err)
				res.send(err)
			res.json(todos);
		});
	});
});
//delete a todo
app.delete('/api/todos/:todo_id', function(req, res){
	Todo.remove({
		_id: req.params.todo_id
	}, function(err, todo){
		if(err)
			res.send(err);
		//get and return all todos after you create another
		Todo.find(function(err, todos){
			if (err) 
				res.send(err);
			res.json(todos);
		});
	});
});
app.get('*', function(req, res){
	res.sendfile('./public/index.html');
});
//listen
app.listen(8080);
console.log("App listening on port 8080");