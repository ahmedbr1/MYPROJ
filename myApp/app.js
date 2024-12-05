var express = require('express');
var path = require('path');
var app = express();
var mongodb = require('mongodb');
const session = require('express-session');
const { request } = require('https');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret1',
  saveUninitialized: true
}))


var username;
var pass;
var searched = [];
var destinations = ['Rome', 'Paris', 'Inca Trail to Machu Picchu', 'Annapurna Circuit', 'Santorini Island', 'Bali Island'];
var wanttogos;
var db;
var admin_wanttogo = []
const MongoClient = mongodb.MongoClient;
var registered = false;

app.get('/', function(req, res){
  
  res.render('login', {success: registered})
  registered = 0;
  
}) ;
app.post('/', function(req, res){
  username = req.body.username;
  pass = req.body.password;
  if (username === 'admin' && pass === 'admin') {
    req.session.user = {username, pass}
    res.redirect('/home')
    return;
  }
  else{
    MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
      db = client.db('myDB');
      db.collection('myCollection').findOne({username: username}).then((json_bourne) => {
        if (!json_bourne) res.render('login', {success: 2});
        else{
          let real_pass = json_bourne.password
          if (pass === real_pass) {
            req.session.user = {username, pass}
            res.redirect('/home');
          }
          else{
            res.render('login', {success: 3})
          }
        }
      });
    }) 
  }
});

app.get('/registration', function(req, res){
  res.render('registration', {success : 1})
}) ;
app.post('/register', function(req, res){
  var new_username = req.body.username;
  var new_pass = req.body.password;

  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: new_username}).then((json_bourne) => {
      if (json_bourne) res.render('registration', {success : 0})
      else{
        db.collection('myCollection').insertOne({username: new_username, password: new_pass, list : []}).then(() => {
          registered = 1;
          res.redirect('/')
        });   
      }
    });
  })
      
    
})

app.get('/home', function(req, res){
  res.render('home')
});

app.get('/cities', function(req, res){
  res.render('cities');
});

app.get('/hiking', function(req, res){
  res.render('hiking')
});

app.get('/islands', function(req, res){
  res.render('islands')
});

app.get('/annapurna', function(req, res){
  res.render('annapurna', {success: 2})
});
app.post('/annapurna', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Annapurna Circuit')){
      res.render('annapurna', {success: 0})
    }
    else{
      admin_wanttogo.push('Annapurna Circuit');
      res.render('annapurna', {success: 1})
    }
    return;
  
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {
      

    wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
    if (! wanttogos.includes('Annapurna Circuit')) {
      wanttogos.push('Annapurna Circuit');
      db.collection('myCollection').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
      res.render('annapurna', {success: 1})
    }
    else{
      res.render('annapurna', {success: 0})
    }
    })
  })
});

app.get('/bali', function(req, res){
  res.render('bali', {success : 2})
});
app.post('/bali', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Bali Island')){
      res.render('bali', {success : 0})
    }
    else{
      admin_wanttogo.push('Bali Island');
      res.render('bali', {success : 1})
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {

    wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
    if (! wanttogos.includes('Bali Island')) {
      wanttogos.push('Bali Island');
      db.collection('myCollection').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
      res.render('bali', {success : 1})
    }
    else{
      res.render('bali', {success : 0})
    }
    })
  })
});

app.get('/inca', function(req, res){
  res.render('inca', {success : 2})
});
app.post('/inca', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Inca Trail to Machu Picchu')){
      res.render('inca', {success : 0})
    }
    else{
      admin_wanttogo.push('Inca Trail to Machu Picchu');
      res.render('inca', {success : 1})
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {

    wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
    if (! wanttogos.includes('Inca Trail to Machu Picchu')) {
      wanttogos.push('Inca Trail to Machu Picchu');
      db.collection('myCollection').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
      res.render('inca', {success : 1})
    }
    else{
      res.render('inca', {success : 0})
    } 
    })
  })
});

app.get('/paris', function(req, res){
  res.render('paris', {success : 2})
});
app.post('/paris', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Paris')){
      res.render('paris', {success : 0})
    }
    else{
      admin_wanttogo.push('Paris');
      res.render('paris', {success : 1})
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {

    wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
    if (! wanttogos.includes('Paris')) {
      wanttogos.push('Paris');
      db.collection('myCollection').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
      res.render('paris', {success : 1})
    }
    else{
      res.render('paris', {success : 0})
    }

    })
  })
});

app.get('/rome', function(req, res){
  res.render('rome', {success : 2})
});
app.post('/rome', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Rome')){
      res.render('rome', {success : 0})
    }
    else{
      admin_wanttogo.push('Rome');
      res.render('rome', {success : 1})
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {

    wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
    if (! wanttogos.includes('Rome')) {
      wanttogos.push('Rome');
      db.collection('myCollection').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
      res.render('rome', {success : 1})
    }
    else{
      res.render('rome', {success : 0})
    }

    })
  })
});

app.get('/santorini', function(req, res){
  res.render('santorini', {success : 2})
});
app.post('/santorini', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Santorini Island')){
      res.render('santorini', {success : 0})
    }
    else{
      admin_wanttogo.push('Santorini Island');
      res.render('santorini', {success : 1})
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {

    wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
    if (! wanttogos.includes('Santorini Island')) {
      wanttogos.push('Santorini Island');
      db.collection('myCollection').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
      res.render('santorini', {success : 1})
    }
    else{
      res.render('santorini', {success : 0})
    }

    })
  })
});

app.get('/wanttogo', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    res.render('wanttogo', {dests: admin_wanttogo});
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('myDB');
    db.collection('myCollection').findOne({username: req.session.user.username}).then(json_bourne => {
      wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
      res.render('wanttogo', {dests: wanttogos});
    })
  })
});

app.get('/searchresults', function(req, res){
  res.render('searchresults', {results: searched})
});
app.post('/search', function(req, res){
  var text = req.body.Search;
  searched = []
  for (var i = 0; i < destinations.length; i++){
    if (destinations[i].toLowerCase().includes(text.toLowerCase())) searched.push(destinations[i]);
  }
  res.redirect('/searchresults')
}) ;


app.listen(3000);




