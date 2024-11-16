var express = require('express');
var path = require('path');
var app = express();
var mongodb = require('mongodb');
const session = require('express-session');
const { request } = require('https');
const PORT = process.env.PORT


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
  
  res.render('login', {successMessage: registered})
  registered = false;
  
}) ;
app.post('/', function(req, res){
  username = req.body.username;
  pass = req.body.password;
  if (username === 'admin' && pass === 'admin') {
    req.session.user = {username, pass}
    res.redirect('/home')
    return;
  }
  if (!username || !pass) res.status(400).json("You must enter a username and password");
  else{
    MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
      db = client.db('MyDB');
      // (db.collection('users').find({username: user}).toArray())[0]
      db.collection('users').findOne({username: username}).then((json_bourne) => {
        if (!json_bourne) res.status(400).json("This username does not exist");
        else{
          let real_pass = json_bourne.password
          if (pass === real_pass) {
            req.session.user = {username, pass}
            res.redirect('/home');
          }
          else{
            res.status(400).json("Wrong Password");
          }
        }
      });
    })
    
  }
  
});

app.get('/registration', function(req, res){
  res.render('registration')
}) ;
app.post('/register', function(req, res){
  var new_username = req.body.username;
  var new_pass = req.body.password;
  if (!new_username || !new_pass) console.log("You must enter a username and password")
    else{
      MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
        db = client.db('MyDB');
        // (db.collection('users').find({username: user}).toArray())[0]
        db.collection('users').findOne({username: new_username}).then((json_bourne) => {
          if (json_bourne) res.status(400).json("This username already exists");
          else{
            db.collection('users').insertOne({username: new_username, password: new_pass}).then(() => {
              registered = true;
              res.redirect('/')
            });   
          }
        });
      })
      
    }
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
  res.render('annapurna')
});
app.post('/annapurna', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Annapurna Circuit')){
      res.status(400).json("Already in list");
    }
    else{
      admin_wanttogo.push('Annapurna Circuit');
    }
    return;
  
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) db.collection('wanttogos').insertOne({username: req.session.user.username, list: ['Annapurna Circuit']})
      else{
        wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
        if (! wanttogos.includes('Annapurna Circuit')) {
          wanttogos.push('Annapurna Circuit');
          db.collection('wanttogos').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
        }
        else{
          res.status(400).json("Already in list");
        }
      }  
    })
  })
});

app.get('/bali', function(req, res){
  res.render('bali')
});
app.post('/bali', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Bali Island')){
      res.status(400).json("Already in list");
    }
    else{
      admin_wanttogo.push('Bali Island');
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) db.collection('wanttogos').insertOne({username: req.session.user.username, list: ['Bali Island']})
        else{
          wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
          if (! wanttogos.includes('Bali Island')) {
            wanttogos.push('Bali Island');
            db.collection('wanttogos').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
          }
          else{
            res.status(400).json("Already in list");
          }
        } 
    })
  })
});

app.get('/inca', function(req, res){
  res.render('inca')
});
app.post('/inca', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Inca Trail to Machu Picchu')){
      res.status(400).json("Already in list");
    }
    else{
      admin_wanttogo.push('Inca Trail to Machu Picchu');
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) db.collection('wanttogos').insertOne({username: req.session.user.username, list: ['Inca Trail to Machu Picchu']})
        else{
          wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
          if (! wanttogos.includes('Inca Trail to Machu Picchu')) {
            wanttogos.push('Inca Trail to Machu Picchu');
            db.collection('wanttogos').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
          }
          else{
            res.status(400).json("Already in list");
          }
        } 
    })
  })
});

app.get('/paris', function(req, res){
  res.render('paris')
});
app.post('/paris', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Paris')){
      res.status(400).json("Already in list");
    }
    else{
      admin_wanttogo.push('Paris');
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) db.collection('wanttogos').insertOne({username: req.session.user.username, list: ['Paris']})
        else{
          wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
          if (! wanttogos.includes('Paris')) {
            wanttogos.push('Paris');
            db.collection('wanttogos').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
          }
          else{
            res.status(400).json("Already in list");
          }
        } 
    })
  })
});

app.get('/rome', function(req, res){
  res.render('rome')
});
app.post('/rome', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Rome')){
      res.status(400).json("Already in list");
    }
    else{
      admin_wanttogo.push('Rome');
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) db.collection('wanttogos').insertOne({username: req.session.user.username, list: ['Rome']})
        else{
          wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
          if (! wanttogos.includes('Rome')) {
            wanttogos.push('Rome');
            db.collection('wanttogos').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
          }
          else{
            res.status(400).json("Already in list");
          }
        } 
    })
  })
});

app.get('/santorini', function(req, res){
  res.render('santorini')
});
app.post('/santorini', function(req, res){
  if (req.session.user.username === 'admin' && req.session.user.pass === 'admin') {
    if (admin_wanttogo.includes('Santorini Island')){
      res.status(400).json("Already in list");
    }
    else{
      admin_wanttogo.push('Santorini Island');
    }
    return;
  }
  MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) db.collection('wanttogos').insertOne({username: req.session.user.username, list: ['Santorini Island']})
        else{
          wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
          if (! wanttogos.includes('Santorini Island')) {
            wanttogos.push('Santorini Island');
            db.collection('wanttogos').updateOne({username: req.session.user.username}, { $set: { list: wanttogos } })
          }
          else{
            res.status(400).json("Already in list");
          }
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
    db = client.db('MyDB');
    db.collection('wanttogos').findOne({username: req.session.user.username}).then(json_bourne => {
      if (!json_bourne) res.render('wanttogo', {dests: []});
      else{
        wanttogos = JSON.parse(JSON.stringify(json_bourne)).list
        res.render('wanttogo', {dests: wanttogos});
      }
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


app.listen(PORT);




