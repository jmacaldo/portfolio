const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var pg = require('pg');
var parseConnectionString = require('pg-connection-string');
const configuration = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog';
const pool = new pg.Pool(typeof configuration === 'string' ? parseConnectionString.parse(configuration) : configuration);


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/blog', function(req, res) {
    pool.connect(function(err, client, done) {
      client.query('select * from blog order by tstamp desc', function(err, result) {
      res.render('blog', {result: result.rows});
        done();
        });
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
