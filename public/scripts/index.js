const [taskbarBtn, urgentBtn, importantBtn, lowPriorityBtn, completedBtn] =
  document.getElementsByClassName('taskbar-btns')
const [taskInput, priorityInput, timeInput, dateInput] =
  document.getElementsByClassName('inputs')
const [addTaskBtn, cancelBtn] = document.querySelectorAll('.input-btns')
const todoUL = document.getElementById('todo-ul')
const _idTempStorage = {
  _id: undefined,
  isinputPost: function () { return this._id === undefined }
}

window.addEventListener('load', function () {
  addTodosToPage()
  taskbarBtn.addEventListener('click', taskbarBtnEventListener)
  urgentBtn.addEventListener('click', urgentBtnEventListener)
  importantBtn.addEventListener('click', importantBtnEventListener)
  lowPriorityBtn.addEventListener('click', lowPriorityBtnEventListener)
  completedBtn.addEventListener('click', completedBtnEventListener)
  addTaskBtn.addEventListener('click', addTaskBtnEventListener)
  cancelBtn.addEventListener('click', cancelBtnEventListener)
})

function cancelBtnEventListener () {
  taskInput.value = ''
  priorityInput.value = ''
  dateInput.value = ''
  timeInput.value = ''
  _idTempStorage._id = undefined
}
function taskbarBtnEventListener () {
  const allTodos = retrieveDataFromSessionStorage('allTodos')
  pipe([
    addContentsTodoUl,
    addEventListenerToCreatedElements
  ])(allTodos, 'Display all task factory')
}

function urgentBtnEventListener () {
  if (window.sessionStorage.urgentTodos) {
    const urgentTodos = retrieveDataFromSessionStorage('urgentTodos')
    pipe([
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(urgentTodos, 'Get urgent todos from saved sessionStorage factory')
  } else {
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      filterData('priority', 'high'),
      storeToSessionStorage('urgentTodos'),
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(todos, 'Get only urgent todos Factory')
  }
}

function importantBtnEventListener () {
  if (window.sessionStorage.importantTodos) {
    const importantTodos = retrieveDataFromSessionStorage('importantTodos')
    pipe([
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(importantTodos, 'Get important todos from saved sessionStorage factory')
  } else {
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      filterData('priority', 'medium'),
      storeToSessionStorage('importantTodos'),
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(todos, 'Get only important todos Factory')
  }
}

function lowPriorityBtnEventListener () {
  if (window.sessionStorage.lowPriorityTodos) {
    const lowPriorityTodos = retrieveDataFromSessionStorage('lowPriorityTodos')
    pipe([
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(lowPriorityTodos, 'Get low priority todos from saved sessionStorage factory')
  } else {
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      filterData('priority', 'low'),
      storeToSessionStorage('lowPriorityTodos'),
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(todos, 'Get only low priority todos Factory')
  }
}

function completedBtnEventListener () {
  if (window.sessionStorage.completedTodos) {
    const completedTodos = retrieveDataFromSessionStorage('completedTodos')
    pipe([
      addContentsTodoUl,
      addEventListenerToCreatedElements
    ])(completedTodos, 'Get completed todos from saved sessionStorage factory')
  } else {
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      filterData('completed', true),
      storeToSessionStorage('completedTodos'),
      addContentsTodoUl,
      addEventListenerToCreatedElements,
      addEventListenerToCreatedElements
    ])(todos, 'Get only completed todos Factory')
  }
}

function addTaskBtnEventListener () {
  if (priorityInput.value && taskInput.value) {
    addTaskBtn.removeAttribute('data-target', '#infoModal')
    if (_idTempStorage.isinputPost()) {
      postTodo(getInputsValue)
    } else {
      const { _id, index } = _idTempStorage
      const updateInfo = { _id, index }
      if (document.getElementById('timer-span' + _id) !== null) {
        console.log('timer at task btn stopped')
        removeDateCountDownTimer(_id)
      }
      updateTodo(getInputsValue, updateInfo)
      _idTempStorage._id = undefined
    }
  } else {
    const modalDescription = {
      title: 'Missing Input !!!',
      description: 'Please ensure you added an input and a priority Level',
      target: addTaskBtn
    }
    document.getElementById('modal-footer').innerHTML = createCloseButton()
    modalAlert(modalDescription)
  }
}

// id text/innerHtml title and body
function modalAlert (modalDescription) {
  const { title, description, target } = modalDescription
  document.getElementById('info-modal-title').innerHTML = title
  document.getElementById('info-modal-description').innerHTML = description
  target.setAttribute('data-target', '#infoModal')
}

async function addTodosToPage () {
  const response = await window.fetch('api/todos')
  const todos = await response.json()
  pipe([
    reverseArrayOrder,
    storeToSessionStorage('allTodos'),
    addContentsTodoUl
  ])(todos, 'Get all todos Factory')
}

async function postTodo (getInputValueFn) {
  try {
    const data = await getInputValueFn()
    const requestData = {
      type: 'POST',
      path: 'api/todos',
      data: data
    }
    const response = await httpRequest(requestData)
    const newPost = await response.json()
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      addLiToTodoUL(newPost),
      pushDataIntoTodoArray,
      storeToSessionStorage('allTodos')
    ])(todos, 'post new Data Factory')
  } catch (error) {
    console.log(error)
  }
}
async function updateTodo (getInputValueFn, updateInfo) {
  // t
  const { _id } = updateInfo
  const data = await getInputValueFn()
  const requestData = {
    type: 'PATCH',
    path: `api/todos/${_id}`,
    data: data
  }
  const response = await httpRequest(requestData)
  const update = await response.json()
  const todos = retrieveDataFromSessionStorage('allTodos')
  pipe([
    getTodoFromArray(update._id),
    updateFoundTodo(update),
    updateLI,
    storeToSessionStorage('allTodos')
  ])(todos, 'put todo factory function')
}

function getInputsValue () {
  const time = timeInput.value ? timeInput.value : ''
  let date = dateInput.value ? new Date(dateInput.value).toDateString() : ''
  if (time && !date) {
    date = new Date().toDateString()
  }
  const inputData = {
    name: taskInput.value,
    priority: priorityInput.value,
    date: date,
    time: time
  }
  // disable button
  taskInput.value = ''
  priorityInput.value = ''
  dateInput.value = ''
  timeInput.value = ''
  return inputData
}

function pushDataIntoTodoArray (object) {
  const copiedArrayList = Array.from(object.todos)
  copiedArrayList.unshift(object.post)
  return copiedArrayList
}
// function clearSessionStorage (todos) {
//   window.sessionStorage.clear()
//   return todos
// }

function filterData (key, filterValue) {
  return (array) => {
    const filteredData = array.filter((data) => data[key] === filterValue)
    return filteredData
  }
}

function pipe (fnsArray, name) {
  const copiedArray = fnsArray.slice()
  return (data) => {
    const result = copiedArray.reduce((accumulator, currentValue) => {
      return currentValue(accumulator)
    }, data)
    return result
  }
}

function reverseArrayOrder (todosArray) {
  return todosArray.slice().reverse()
}

function storeToSessionStorage (key) {
  return (todos) => {
    window.sessionStorage.setItem(key, JSON.stringify(todos))
    return todos
  }
}

function retrieveDataFromSessionStorage (key) {
  return JSON.parse(window.sessionStorage.getItem(key))
}

function addContentsTodoUl (dataArray) {
  todoUL.innerHTML = ''
  dataArray.forEach((todo, index) => {
    todoUL.appendChild(createNodeLi(todo))
    addDateCountDownTimer(todo, index)
    addEventListenerToCreatedElements(todo, index)
  })
  return dataArray
}

function addLiToTodoUL (post) {
  return (todos) => {
    const newLi = createNodeLi(post)
    todoUL.prepend(newLi)
    addDateCountDownTimer(post)
    addEventListenerToCreatedElements(post, 0)
    return { post, todos }
  }
}

function createNodeLi (todo) {
  const { name, createdDate, completed, priority, _id, time, date } = todo
  const li = `<li class="list-group-item lis">
                               ${selectIndicator(priority)}
                                <div class="widget-content p-0">
                                    <div class="widget-content-wrapper">
                                        <div class="widget-content-left mr-2">
                                            <div class="custom-checkbox custom-control">
                                             <input class="custom-control-input" id="${'check-box' + _id}"
                                                    type="checkbox" ${taskCompletedCheck(completed)}>
                                                   <label class="custom-control-label"
                                                    for="${'check-box' + _id}">&nbsp;</label>
                                            </div>
                                        </div>
                                        <div class="widget-content-left flex2">
                                            <div id="name-div${_id}" class="widget-heading ${addDoneClass(completed)}"  data-_id ="${_id}">
                                             ${name}
                                             ${checkTodoImportance(priority)}
                                             </div>
                                            <div class="widget-subheading"> 
                                            <span> Created Date: ${setDay(createdDate)}</span>
                                            ${setEndDate(date, time)} 
                                            ${createSpanForTimer(_id, date)}
                                             </div>
                                        </div>
                                        <div class="widget-content-right"> 
                                                 <button id="update-btn${_id}" class="border-0 btn-transition btn btn-outline-primary update-btn " ${buttonDisableAttri(completed)} > 
                                                 <i class="fa fa-pencil"></i></button> 
                                                    <button id="delete-btn${_id}" class="border-0 btn-transition btn btn-outline-danger delete-btn" data-toggle="modal" ${buttonDisableAttri(completed)}>
                                                     <i class="fa fa-trash"> </i> </button>
                                          </div>
                                    </div>
                                </div>
                            </li>`
  return document.createRange().createContextualFragment(li)
}

function selectIndicator (priority) {
  switch (priority) {
    case 'high':
      return '<div class="todo-indicator bg-danger"></div>'
    case 'medium':
      return '<div class="todo-indicator bg-warning"></div>'
    case 'low':
      return '<div class="todo-indicator bg-secondary"></div>'
    default:
      return '<div class="todo-indicator bg-secondary"></div>'
  }
}

function taskCompletedCheck (completed) {
  if (completed) return 'checked'
  return ''
}

function addDoneClass (completed) {
  if (completed) {
    return 'done'
  }
  return ''
}

function buttonDisableAttri (completed) {
  if (completed) {
    return 'disabled'
  }
  return ''
}

function checkTodoImportance (priority) {
  switch (priority) {
    case 'high':
      return '<div class="badge badge-danger ml-2"> Urgent!! </div>'
    case 'medium':
      return '<div class="badge badge-warning ml-2"> Important </div>'
    case 'low':
      return '<div class="badge badge-pill badge-secondary ml-2">low</div>'
    default:
      return '<div class="badge badge-secondary ml-2">low</div>'
  }
}

function setDay (createdDate) {
  const setDay = new Date(createdDate)
  const hours = setDay.getHours() < 10 ? '0' + setDay.getHours() : setDay.getHours()
  const minutes = setDay.getMinutes() < 10 ? '0' + setDay.getMinutes() : setDay.getMinutes()
  const time = hours + ':' + minutes
  const date = setDay.toDateString()
  return `${date} ${time}`
}
function setEndDate (date, time) {
  if (date === '' && time === '') {
    return ''
  } else {
    return `<span class="ml-2"> <span class="mr-2"> - </span>    End Date: ${date} ${time} </span>`
  }
}

function createSpanForTimer (_id, date, index) {
  if (date === '') return ''
  return ` <span class="ml-2"> - </span> <span class="ml-2" id="timer-span${_id}" data-toggle="modal"> </span> `
}

function addEventListenerToCreatedElements (todo, index) {
  const { _id } = todo
  const deleteButton = document.getElementById('delete-btn' + _id)
  const updateButton = document.getElementById('update-btn' + _id)
  const checkbox = document.querySelector('#check-box' + _id)
  deleteButton.addEventListener('click',
    function () { deleteBtnEventListner(this, todo) })
  updateButton.addEventListener('click',
    function () { updateBtnEventListerner(_id) })
  checkbox.addEventListener('click', function () { checkboxEventListener(this, todo) })
  return todo
}

async function checkboxEventListener (checkbox, todo) {
  const { _id } = todo
  const requestData = {
    type: 'PATCH',
    path: `api/todos/${_id}`,
    data: undefined
  }

  if (checkbox.checked) {
    requestData.data = { completed: true }
    const response = await httpRequest(requestData)
    const update = await response.json()
    const classData = {
      class: 'add',
      disableButtons: true
    }
    console.log(update)
    if (document.getElementById('timer-span' + _id) !== null) {
      console.log('timer at checkbox stopped')
      removeDateCountDownTimer(_id)
    }
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      getTodoFromArray(_id),
      updateFoundTodo(update),
      classAction(classData)
    ])(todos, 'checked checkbox todo factory')
  } else {
    const classData = {
      class: 'remove',
      disableButtons: false
    }
    requestData.data = { completed: false }
    const response = await httpRequest(requestData)
    const update = await response.json()
    console.log(update)
    console.log('timer at checkbox started')
    addDateCountDownTimer(todo)
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      getTodoFromArray(_id),
      updateFoundTodo(update),
      classAction(classData),
      storeToSessionStorage
    ])(todos, 'checked uncheckbox todo factory')
  }
}

async function httpRequest (requestData) {
  const { type, path, data } = requestData
  const response = await window.fetch(path, {
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Network response was not OK')
  }
  return response
}

function classAction (action) {
  return (object) => {
    const { todo, todos } = object
    document.getElementById('name-div' + todo._id).classList[action.class]('done')
    document.getElementById('update-btn' + todo._id).disabled = action.disableButtons
    document.getElementById('delete-btn' + todo._id).disabled = action.disableButtons
    return todos
  }
}

function deleteBtnEventListner (deleteButton, todo) {
  const { _id, name } = todo
  _idTempStorage._id = _id
  const modalDescription = {
    title: 'Missing Input !!!',
    description: `Are You sure you want to Delete <b> ${name.toUpperCase()}? </b>`,
    target: deleteButton
  }
  document.getElementById('modal-footer').innerHTML = createYesAndNoButton()
  addEventListenerToYesBtn()
  modalAlert(modalDescription)
}

function createYesAndNoButton () {
  return `<button id="delete-option-yes" type="button" class="btn btn-danger"
                        data-dismiss="modal">Yes</button>
                    <button type="button" class="btn btn-success" data-dismiss="modal">No</button>`
}

function addEventListenerToYesBtn () {
  const deleteOptionYes = document.getElementById('delete-option-yes')
  deleteOptionYes.addEventListener('click', deleteOptionYesEventListener)
}

function createCloseButton () {
  return '<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>'
}

async function deleteOptionYesEventListener () {
  try {
  // delete button for modal reset modal
    const _id = _idTempStorage._id
    _idTempStorage._id = undefined
    if (document.getElementById('timer-span' + _id) !== null) {
      removeDateCountDownTimer(_id)
    }
    const response = await window.fetch(`api/todos/${_id}`,
      {
        method: 'DELETE'
      })
    if (!response.ok) {
      throw new Error('Network response was not OK')
    }
    const feedBack = await response.json()
    console.log(feedBack)
    const todos = retrieveDataFromSessionStorage('allTodos')
    pipe([
      deleteTodoObjectFromArray(_id),
      deleteLiFromDom,
      storeToSessionStorage('allTodos')
    ])(todos, 'Delete factory')
  } catch (error) {
  }
}

function removeDateCountDownTimer (_id) {
  const timerSpan = document.getElementById('timer-span' + _id)
  const timer = timerSpan.dataset.timer
  timerSpan.classList.remove('blinking')
  clearInterval(Number(timer))
}

function deleteLiFromDom (object) {
  const currentLi = document.getElementsByClassName('lis')[object.index]
  currentLi.remove()
  return object.todos
}

function deleteTodoObjectFromArray (_id) {
  return (todos) => {
    const newTodos = todos.filter(todo => todo._id !== _id)
    const deletedTodoIndex = todos.findIndex(todo => todo._id === _id)
    return { todos: newTodos, index: deletedTodoIndex }
  }
}
function updateBtnEventListerner (_id) {
  _idTempStorage._id = _id
  const todos = retrieveDataFromSessionStorage('allTodos')
  pipe([
    getTodoFromArray(_id),
    updateInput
  ])(todos, 'update input')
}

function getTodoFromArray (_id) {
  return (todos) => {
    const todo = todos.filter(todo => todo._id === _id)
    const index = todos.findIndex(todo => todo._id === _id)
    return { todo, todos, index }
  }
}

function updateInput (object) {
  const [todo] = object.todo
  taskInput.value = todo.name
  priorityInput.value = todo.priority
  dateInput.value = todo.date ? inputDateFormat(todo.date) : ''
  timeInput.value = todo.time
}

function inputDateFormat (date) {
  const createdDate = new Date(date)
  const year = createdDate.getFullYear()
  const month = createdDate.toLocaleString('default', { month: 'short' })
  const day = createdDate.getDate()
  return `${day}-${month}-${year}`
}

function updateFoundTodo (update) {
  return (object) => {
    const [todo] = object.todo
    const updatedTodo = Object.assign(todo, update)
    const newObj = { todo: updatedTodo, todos: object.todos, index: object.index }
    console.log(newObj)
    return newObj
  }
}

function updateLI (object) {
  const { todo, todos, index } = object
  console.log(todo)
  const currentLi = document.getElementsByClassName('lis')[index]
  const updatedLi = createNodeLi(todo)
  currentLi.replaceWith(updatedLi)
  console.log('timer started at update')
  addDateCountDownTimer(todo)
  addEventListenerToCreatedElements(todo, index)
  return todos
}

function addDateCountDownTimer (todo) {
  const { name, time, date, _id } = todo
  if (date === '') {
    return ''
  } else {
    // run on update only
    console.log('timer start date couner')
    let alerted = 'no'
    let timerIDAddedToDataSet = false
    const dueDate = new Date(`${date} ${time}`).getTime()
    document.getElementById('timer-span' + _id).classList.add('text-success')
    const timer = setInterval(function () {
      const timeSpan = document.getElementById('timer-span' + _id)
      const todaysDate = new Date().getTime()
      const timeLeft = dueDate - todaysDate
      if (!timerIDAddedToDataSet) {
        timerIDAddedToDataSet = addTimerIdToDataSet({ timeSpan, timer })
      }
      if (timeLeft > 0) {
        timeSpan.textContent = countDown(timeLeft)
        if (timeLeft < 300000 && timeLeft > 120000) {
          switch (alerted) {
            case 'no':
              timeSpan.classList.add('blinking')
              alertUser(timeSpan, name)
              alerted = 'alerted'
              break
          }
        } else if (timeLeft < 120000) {
          alerted = alertType2([timeSpan, name, alerted])
        }
      } else {
        timeSpan.textContent = stopTimer(timer, timeSpan)
      }
    }, 1000)
  }
}

// function setInervalFn () {

// }

function addTimerIdToDataSet (object, timerIDAddedToDataSet) {
  const { timeSpan, timer } = object
  timeSpan.dataset.timer = timer
  return true
}

function alertType2 (variables) {
  const [timeSpan, name, alerted] = variables
  switch (alerted) {
    case 'no':
      timeSpan.classList.add('blinking')
      alertUser(timeSpan, name)
      return 'alerted blinking'
    case 'alerted':
      timeSpan.classList.add('blinking')
      return 'alerted blinking'
  }
  return 'no'
}

// case 2 {case2: }

function stopTimer (timer, timeSpan) {
//   const timerSpan = document.getElementById('timer-span')
  console.log('timer at date function stopped')

  timeSpan.classList.remove('blinking')
  timeSpan.classList.add('text-danger')
  clearInterval(timer)
  return 'Expired'
}

function countDown (timeLeft) {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const dayDisplay = days !== 0 ? days + 'd ' : ''
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const hourDisplay = hours !== 0 ? hours + 'h ' : ''
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const minutesDisplay = minutes !== 0 ? minutes + 'm ' : ''
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  return 'Time Left: ' + dayDisplay + hourDisplay + minutesDisplay + seconds + 's'
}

function alertUser (timeSpan, name) {
  const modalDescription = {
    title: 'Warning !!!',
    description: `You have less than 5mins Left to complete ${name}`,
    target: timeSpan
  }
  timeSpan.classList.remove('text-success')
  timeSpan.classList.add('text-danger')
  document.getElementById('modal-footer').innerHTML = createCloseButton()
  modalAlert(modalDescription)
  timeSpan.click()
}

function clearTime () {
  document.getElementById('time-input').value = ''
}

// // function pipe (fn1, fn2) { return data => fn2(fn1(data)) }
// const pipe = (fn1, fn2) => data => fn2(fn1(data))
// const arr = [1, 2, 3, 2, 3, 1]
// function filterData (dataValue, dataKey) {
//   return (array) => {
//     const filteredData = array.filter(data => {
//       if (data === dataValue, dataKey) {
//         return data
//       } else {
//         return ''
//       }
//     })
//     return filteredData
//   }
// }

// filterData(1)(arr)
