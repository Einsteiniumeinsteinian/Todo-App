const express = require('express')
const router = express.Router()
const expressJson = express.json()
const expressUrlEncoded = express.urlencoded({
  extended: true
})
const {
  getTodoFn,
  createTodoFn,
  showTodoFn,
  updateTodoFn,
  deleteTodoFn
} = require('../utils/routeFns')

router.route('/')
  .get(getTodoFn)
  .post(expressUrlEncoded, expressJson, createTodoFn)
// router.post('/', createTodoFn)
router.route('/:todoId')
  .get(showTodoFn)
  .patch(expressUrlEncoded, expressJson, updateTodoFn)
  .delete(deleteTodoFn)

module.exports = router
