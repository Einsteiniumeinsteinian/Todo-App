const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/todo_app')
mongoose.set('debug', true)

// const User = require('./user');
module.exports.Todo = require('./todo')
