const db = require('../models')
// const updateExistingDatabase = () => {
//   db.Todo.updateMany({}, { $rename: { : 'name' } }, { multi: true }, function (err, blocks) {
//     if (err) { throw err }
//     console.log('done!')
//   })
// }

const removeSchemaField = () => {
  db.Todo.updateMany({}, { $unset: { taste: 1 } })
}

module.exports = { removeSchemaFieldFn: removeSchemaField }
