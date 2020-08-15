var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'compareString10',
	database : 'activities_db'
});


var app = express();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/views/layouts/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.listen(3000);



























// const express = require("express");
// const foodRoutes = require("./controllers/foods_controller");
// const movieRoutes = require("./controllers/movies_controller");
// const parkRoutes = require("./controllers/parks_controller");
// const app = express();

// PORT = process.env.PORT || 8080;

// app.use(express.static("public"));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // This might need to be edited to be cleaner
// app.use(foodRoutes);
// app.use(movieRoutes);
// app.use(parkRoutes);
// // We can uncommoent this if we want to use handlebars
// // var exphbs = require("express-handlebars");

// // app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// // app.set("view engine", "handlebars");

// app.listen(PORT, () => {
//   console.log(`Server listening on: http://localhost:${PORT}`);
// });
