/* 
漸層視覺上的變化
(black,white 100%) => 漸層黑到白的中間點(黑白各半)
(black 100%, white) => 全黑

分兩組動畫執行
01.執行全白到黑白各半
02.執行黑白各半到全黑
(一次執行完整個字的完整動畫太過緩慢=>執行到一半時呼叫下個字的動畫)
!!只能呼叫一次第二個動畫一次
*/ 


//(black,white 0%)=> (black,white 100%)動畫
let initValue1 = 0
let id1 = 1
let interval1 = null

//(black 0%,white)=> (black 100%,white)動畫
let initValue2 = 0
let id2 = 1
let interval2 = null
//文字漸變速率
let speed = 2.5

//小圓畫線填充動畫
let strokeOffset = 26
let circle = document.querySelector('.stroke')
let cirStrokeInterval = null
let cirFillInterval = null

//背景漸變動畫
let backinterval = null


window.onload = () => {
  // setTimeout(()=>{
    gradientAnimate1()
    interval1 = setInterval(gradientAnimate1,5)
  // },300)
}

// interval1 = setInterval(gradientAnimate1,4)

//01.文字漸變動畫01
function gradientAnimate1() {
  initValue1++
  let v = initValue1*speed
  const d = document.querySelector(`.page-load-word[data-index="${id1}"]`)
  const animateWord = document.querySelector(`.text2[data-index="${id1}"]`)
  const Wordanimate = document.querySelector(`.text1[data-index="${id1}"]`)
  Wordanimate.style.stopColor = 'white'
  //動畫執行
  if(v<=100) {
    animateWord.setAttribute('offset',`${v}%`)
  }
  //呼叫第二個動畫
  if(id1==1&&v>100) {
    interval2 = setInterval(gradientAnimate2,5)
  }
  //換下一個字執行動畫
  if(v>100) {
    id1 = id1+1
    initValue1= 0
  } 
  //執行完停止
  if(id1 > 7) {
    interval1 = clearInterval(interval1)
  }
}



//02.文字漸變動畫02
function gradientAnimate2() {
  initValue2++
  let v = initValue2*speed
  const animateWord = document.querySelector(`.text1[data-index="${id2}"]`)
  if(v<=100) {
    animateWord.setAttribute('offset',`${v}%`)
  }
  else {
    id2 = id2+1
    initValue2= 0
  } 
  if(id2 > 7) {
    interval2 = clearInterval(interval2)
    cirStrokeInterval = setInterval(cirStrokAnimate,20)
  }
}

function cirStrokAnimate() {
  strokeOffset--
  circle.style.strokeDashoffset = `${strokeOffset--}`
  if(strokeOffset==0) {
    clearInterval(cirStrokeInterval)
    cirFillInterval = setInterval(cirFillAnimate,4)
  }
}

const fillBlack =  document.querySelector('.stop1')
let fillPercent = 0
function cirFillAnimate() {
  fillPercent++
  fillBlack.setAttribute('offset',`${fillPercent*2}%`)
  if(fillPercent*2>100) {
    clearInterval(cirFillInterval)
    setTimeout(function() {
      backinterval = setInterval(opacityLoadingPage,4)
    },300)
  }
}
//LOADING背景漸變消失
const loadContainer = document.querySelector('.page-load-container')
let opacity = 1
function opacityLoadingPage() {
  opacity = opacity-0.01
  loadContainer.style.opacity = `${opacity}`
  if(opacity<0) {
    loadContainer.style.display = 'none'
    clearInterval(backinterval)
  }
}



