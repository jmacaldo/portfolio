var fs = require('fs');
var express = require('express');
var app = express();
var parser = require('body-parser');
var path = ('path');
var pg = require('pg');
var parseConnectionString = require('pg-connection-string');
var cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 5000

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const configuration = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog';
const pool = new pg.Pool(typeof configuration === 'string' ? parseConnectionString.parse(configuration) : configuration);

app.set('view engine', 'ejs');


//main view
app.get('/', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('select * from blog order by tstamp desc', function(err, result) {
    res.render('blog', {result: result.rows});
      done();
      });
  });
}); // router close

//cool heroku test route
app.get('/cool', function(request, response) {
  response.send(cool());
});

//blog
app.get('/blog', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('select * from blog order by tstamp desc', function(err, result) {
    res.render('blog', {result: result.rows});
      done();
      });
  });
}); // router close

//blog
app.get('/manager', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('select * from blog order by tstamp desc', function(err, result) {
    res.render('manager', {result: result.rows});
      done();
      });
  });
}); // router close

//submit button
app.post('/add', function(req,res){
  pool.connect(function(err, client, done) {
    client.query(`insert into blog (title,body,image) values ($1, $2, $3)`,[req.body.title,req.body.message,req.body.image]);
      done();
      res.redirect('/');
      });
  }); //router close

//delete all
app.delete('/delete', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('delete from blog', function(err, result) {
      res.sendStatus(200);
      done();
      });
  });
}); // router close

//post page
 app.get('/post', function(req,res){
   res.render('post', {});
}); //router close


//delete by message id
app.delete('/delete/:id', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('delete from blog where id = $1',[req.params.id], function(err, result) {
      res.sendStatus(200);
      done();
      });
  });
}); // router close


//No modifications below this line!

//if no routes are matched, return a 404
app.get('*', function(req, res) {
    res.status(404).send('<h1>uh oh! page not found!</h1>');
});

//have the application listen on a specific port
app.listen(port, function () {
    console.log("App is running on port " + port);
});
