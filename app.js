const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const { homeRouteFn, unusedRoutesFn } = require('./utils/appJsRouteFns')
const { removeSchemaFieldFn } = require('./utils/databaseFns')
// Routes
const todoRoutes = require('./routes/todo')

// ? body parser
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));
// ? Routes
app.use(express.static(path.join(__dirname, '/views')))
app.use(express.static(path.join(__dirname, '/public')))
app.use('/api/todos', todoRoutes)

removeSchemaFieldFn()

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/views/todos/index.html'))
// })

app.get('/', homeRouteFn)

app.get('*', unusedRoutesFn)

app.listen(port, () => {
  console.log(`port running at ${port}`)
})
