// class ErrorHandler {
//   constructor (message, path) {
//     this.message = message
//     this.path = path
//   }
// }
// const setTimeZone = (sign, number) => {
//   if (isNaN(number)) throw new ErrorHandler('second param must be a number', 'utils/date.Js/setDate')
//   if (sign === '+') {
//     return number * 3600000
//   } else if (sign === '-') {
//     return number * -3600000
//   }
//   throw new ErrorHandler('sign must be either + or -', 'utils/date.Js/setDate')
// }

// const setDate = (sign, number) => {
//   const timeZone = setTimeZone(sign, number)
//   return () => {
//     const date = Date.now() + timeZone
//     return new Date()
//   }
// }

const setDate = () => {
  const createdDate = new Date()
  const hours = createdDate.getHours() < 10 ? '0' + createdDate.getHours() : createdDate.getHours()
  const minutes = createdDate.getMinutes() < 10 ? '0' + createdDate.getMinutes() : createdDate.getMinutes()
  const time = hours + ':' + minutes
  const date = createdDate.toDateString()
  return `${date} ${time}`
}

module.exports = {
  setDateFn: setDate
}
