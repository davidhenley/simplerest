const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/users/users');

const User = require('./models/user');

app.use(bodyParser.json());
app.use(morgan('dev'));

const router = express.Router();

router.use(function(req, res, next) {
  console.log('Something is happening');
  next();
});

router.get('/', function(req, res){
  res.json({ message: 'Welcome to our api!' });
});

router.route('/users')
  .post(function(req, res) {
    const user = new User();
    user.name = req.body.name;
    user.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'User created!' });
    });
  })
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) res.send(err);
      res.json(users);
    });
  });

router.route('/users/:user_id')
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
      res.json(user);
    });
  })
  .put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
      user.name = req.body.name;
      user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'User updated!' });
      });
    });
  })
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) res.send(err);
      res.json({ message: 'User deleted' });
    });
  });

app.use('/api', router);

const port = process.env.PORT || 3090;
app.listen(port);
console.log('Server listening on port:', port)
