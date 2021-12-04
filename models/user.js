const mongoose = require('mongoose')

// First name:
// Last name
// email
// password
// user to be connected to their todo
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }]
})

module.exports = mongoose.model('User', UserSchema)
