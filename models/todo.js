const mongoose = require('mongoose')
const { setDateFn } = require('../utils/dateFns')
const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name cannot be blank'
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: String,
    default: setDateFn
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  date: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
