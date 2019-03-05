const data= JSON.parse(localStorage.getItem('order'))
const currentOrder = data[data.length-1]


const number = document.querySelector('.success-number-value')
const time = document.querySelector('.success-time-value')
const price = document.querySelector('.success-pay-price')
const orderTextWrap = document.querySelector('.success-text-wrap')

number.textContent = currentOrder.number
price.textContent = currentOrder.price
time.textContent =  currentOrder.time


var canvas = document.getElementById("mycanvas")
var ctx = canvas.getContext("2d")

canvas.width = 200
canvas.height = 200

let degree = 0
function circle() {
  degree++
  ctx.beginPath()
  ctx.arc(100,100,50,0,degree*0.4)
  ctx.strokeStyle = '#c49871'
  ctx.lineWidth = 5
  ctx.stroke()
  if(degree*0.2>3.14) {
    requestAnimationFrame(check)
    return
  }
  requestAnimationFrame(circle)
}
let line = 0
function check() {
  orderTextWrap.classList.add('show')
  line++
  let a = line*3
  if(77+a<97&&95+a<115) {
    ctx.beginPath()
    ctx.moveTo(77,95)
    ctx.lineTo(77+a,95+a)
    
  }
  else {
    ctx.lineTo(97,115)
    ctx.lineTo(97+a,115-a)
    if(97+a>=127&&115-a<=85) {
      return  
    }
  }
  ctx.strokeStyle = '#c49871'
    ctx.lineWidth = 5
    ctx.stroke()
  requestAnimationFrame(check)
}

requestAnimationFrame(circle)



