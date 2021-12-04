// const test = document.getElementById('lis').childNodes[2].nextSibling.childNodes[1].childNodes[3].childNodes[1].firstChild.textContent
// const test = document.getElementById('lis').childNodes[2].nextSibling.childNodes[1].childNodes[3].textContent

// const test = document.getElementById('lis').textContent.firstChild
// const test = document.getElementById('lis').firtextContent
// console.log(test)
dateCountDownTimer()
function dateCountDownTimer (date, time) {
  // check created date
//   if (date === '' && time === '') {
//     return ''
//   } else {
  const timerSpan = document.getElementById('timer-span')
  const dueDate = new Date('8-Nov-2021 19:37').getTime()
  const todaysDate = new Date().getTime()
  console.log('todays Date', todaysDate)
  console.log('due Date', dueDate)
  // is due date greater than today? else run below
  const timer = setInterval(function () {
    const todaysDate = new Date().getTime()
    const timeLeft = dueDate - todaysDate
    if (timeLeft >= 0) {
      countDown(timeLeft)
    } else {
      stopTimer(timer)
    }

    //
    // console.log(dueDate, date, seconds)
    // timerSpan.innerText = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's'
  }, 1000)
//   }
}
function stopTimer (timer) {
//   const timerSpan = document.getElementById('timer-span')
//   timerSpan.innerText = 'Date Due'
  clearInterval(timer)
}

function countDown (timeLeft) {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  console.log('todays Date', days, hours, minutes, seconds)
}
