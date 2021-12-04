const path = require('path')
const homePath = path.join(__dirname, '../', 'views/todos/index.html')
const homeRoute = (req, res) => {
  res.sendFile(homePath)
}
// /home/einstein/Documents/toDo App/views/todos  views/todos/index.html'
const unusedRoutes = (req, res) => {
  res.send('page does not exist')
}

module.exports = {
  homeRouteFn: homeRoute,
  unusedRoutesFn: unusedRoutes
}
