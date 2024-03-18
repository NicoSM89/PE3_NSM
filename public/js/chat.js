const socket = io()

let userName

Swal.fire({
  title: 'Enter your email',
  input: 'text',
  inputValidator: (value)=>{
    if (!value){
      return 'You have to enter an email'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
          return 'Enter a valid email address';
    }
  } 
}).then (data =>{
  userName=data.value
socket.emit('newUser', userName)
})

const inputData=document.getElementById("inputData")
const outputData=document.getElementById("outputData")

inputData.addEventListener('keyup', (event)=>{
  if (event.key === 'Enter'){
    if (inputData.value.trim().length>0)
    {
      socket.emit('message', {user:userName, message: inputData.value})
      inputData.value=""
    }
  }
})

socket.on('messageLogs', data => {
  let messages = ''
  data.forEach(message => {
    messages += `<b>${message.user}: </b>  ${message.message} <br/>`
  })
  outputData.innerHTML = messages
})

socket.on('notification', user=>{
  Swal.fire({
    text: `${user} is online`,
    toast: true,
    position: 'top-right',
  })
})