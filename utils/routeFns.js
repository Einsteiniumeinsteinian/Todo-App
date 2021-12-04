const db = require('../models')

const getTodos = async (req, res) => {
  const todos = await db.Todo.find()
  res.json(todos)
}

const createTodo = async (req, res) => {
  console.log('body', req.body)
  const newTodo = await db.Todo.create(req.body)
  res.status(201).json(newTodo)
}

const showTodo = async (req, res) => {
  const todo = await db.Todo.findById(req.params.todoId)
  res.json(todo)
}

// /:todo
const updateTodo = async (req, res) => {
  const updatedtodo = await db.Todo.findByIdAndUpdate(
    req.params.todoId,
    req.body,
    { new: true })
  res.json(updatedtodo)
}

const deleteTodo = async (req, res) => {
  const deletedTodo = await db.Todo.findByIdAndDelete(req.params.todoId)
  res.json({ message: 'deleted successfully', deletedTodo: deletedTodo })
}

const errorHandler = (customMessage) => {
  return (error) => {
    console.log(`Error at ${customMessage}`)
    console.log(error)
  }
}
const wrapAsyncFn = (fn, errorHandler) => {
  return (req, res) => {
    fn(req, res).catch(errorHandler)
  }
}

const asyncwrapper = (asyncFnObj, errorHandlerFn) => {
  const copiedAsnycFnObj = Object.assign({}, asyncFnObj)
  const wrappedAsnycObj = {}
  for (const [key, value] of Object.entries(copiedAsnycFnObj)) {
    wrappedAsnycObj[key] = wrapAsyncFn(value, errorHandlerFn(key))
  }
  return wrappedAsnycObj
}

// console.log(wrapAsyncFn(showTodo, errorHandler))

module.exports = asyncwrapper({
  getTodoFn: getTodos,
  createTodoFn: createTodo,
  showTodoFn: showTodo,
  updateTodoFn: updateTodo,
  deleteTodoFn: deleteTodo
}, errorHandler)
