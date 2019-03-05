/* exported  container body initUrl searchBtn createLoader clearLoader pageTransitionAnimate*/

//設置locakstorage
if(!localStorage.getItem('product')) {
  let storage = []
  localStorage.setItem('product',JSON.stringify(storage))
}
// API
const baseUrl = 'https://api.appworks-school.tw/api/1.0/products'
let cataUrl = null

// HREF
let query = window.location.search //含問號之後
let path = window.location.pathname //資料夾
// RENDER
const container = document.querySelector('.main-container') // 頁面初始化loader父層
const body = document.querySelector('body')
const starterLoader = document.querySelector('.page-load-container')


// 帶參數情況=>複用模板(類別/搜索)(單一商品)
if(query) {
  if(query.indexOf('?search?keyword=')!==-1) {
    cataUrl = `${query.split('').splice(1).join('')}&`
    starterLoader.style.display = 'none'
  }
  else if(path.indexOf('/product.html')!==-1) {
    let id = query.split('=')[1]
    id = id.split('&')[0]
    cataUrl = `details?id=${id}`
  }
  else if(query.indexOf('?category=')!==-1){
    cataUrl = query.split('=')[1]
    starterLoader.style.display = 'none'
  } 
}
else if(path.indexOf('/index.html')!==-1&&!query) {
  cataUrl = 'all'
  starterLoader.style.display = 'block'
}
else if(path==='/STYLiSH/') {
  cataUrl = 'all'
  starterLoader.style.display = 'block'
}

let initUrl = `${baseUrl}/${cataUrl}`

//頁面初始(要改成login後才可以看到購物車內商品數)
function pageInit() {
  getCartTotal()
}
pageInit()

// -----header相關控制項-----//
// 切換active類別CSS樣式
const cataLink = document.querySelectorAll('.js-link')
const cataIndicator = document.querySelectorAll('.nav-indicator')
cataLink.forEach(el=>{
  if(el.dataset.cata===cataUrl) el.classList.add('active')  
})
cataIndicator.forEach(el=>{
  if(el.dataset.cata===cataUrl) el.classList.add('active')
})

//搜尋元件
const searchBtn = document.querySelectorAll('.search-btn') //搜尋按鈕
const input = document.querySelectorAll('.search-input') //輸入框
const smDecorBtn = document.querySelector('.sm-search-btn-decor') //展開搜索框按鈕
const smSearchFrame = document.querySelector('.sm-search-frame') //搜索框
const closeBtn = document.querySelector('.close-btn') //關閉搜索框
const form = document.querySelectorAll('.form-container')

//搜索框聚焦
input.forEach(el=>el.focus())
//form表單提交(預設包含滑鼠與keyboard)
form.forEach(el=>el.addEventListener('submit',searchHandler))

//搜索
function searchHandler(e) {
  e.preventDefault()
  let search = null
  input.forEach(el => {
    if(el.value) search = el.value.trim()
  })
  if(!search) return
  window.location.href = `index.html?search?keyword=${search}`
}

//顯示搜索
smDecorBtn.addEventListener('click',showSearchFrame)
function showSearchFrame() {
  smDecorBtn.style.display = 'none'
  smSearchFrame.classList.add('showFrame')
}
//關閉搜索
closeBtn.addEventListener('click',closeSearchFrame)
function closeSearchFrame() {
  smSearchFrame.classList.remove('showFrame')
  smDecorBtn.style.display = 'block'
}
//顯示購物車數量
function getCartTotal(){
  const cartArray = JSON.parse(localStorage.getItem('product'))
  const numWrap = document.querySelectorAll('.cart-num-wrap')
  const num = document.querySelectorAll('.cart-num')
  const quantity = cartArray.map(el=>el.qty)
    let total = quantity.reduce((acc,cur)=>{
      return acc + cur
    },0)
    if(total>0) {
      numWrap.forEach(el=>el.classList.add('show'))
      num.forEach(el=>el.textContent=total)
    }
    else {
      numWrap.forEach(el=>el.classList.remove('show'))
      num.forEach(el=>el.textContent='')
    }

}

//-----下滑載入loader-----//
//loader
function createLoader(){
  const loaderWrap = document.createElement('div')
  loaderWrap.className = 'loader-wrap'
  const loader = document.createElement('img')
  loader.className = 'loader-img'
  loader.setAttribute("src",`images/loading.gif`) 
  loaderWrap.appendChild(loader) 
  return loaderWrap 
}

//清除loader
function clearLoader(){
  const loader = document.querySelector('.loader-wrap')
  if(loader) {
    loader.parentNode.removeChild(loader)
  }
}

//轉場動畫函式
// let transOpacity = 1

// let transOpacity = null
// const width = window.innerWidth 
// if(width<575) transOpacity = 0.5
// else transOpacity = 1
// function pageTransitionAnimate() {
//   const transLayout = document.querySelector('.transition-layout')
//   transOpacity = transOpacity-0.08
//   transLayout.style.opacity = `${transOpacity}`
//   if(transOpacity<0) {
//     transLayout.style.display = 'none'
//     return
//   }
//   requestAnimationFrame(pageTransitionAnimate)
// }
// console.log(window.innerWidth)
let transOpacity = 0
function pageTransitionAnimate() {
  // const transLayout = document.querySelector('.transition-layout')
  transOpacity = transOpacity+0.05
  container.style.opacity = `${transOpacity}`
  if(transOpacity>100) {
    // transLayout.style.display = 'none'
    return
  }
  requestAnimationFrame(pageTransitionAnimate)
}



const header = document.querySelector('.lg-header')
const decorationBar = document.querySelector('.lg-header-decoration')
// const banner = document.querySelector('.hero-image-wrap')
window.addEventListener('scroll',headerHander)

function headerHander(){
  const headerHeight = header.clientHeight
  if(scrollY>headerHeight) {
    decorationBar.classList.add('decrease-bar')
  }
  else {
    decorationBar.classList.remove('decrease-bar')
  }
  // const bannerBottom = banner.getBoundingClientRect().bottom
  // console.log(bannerBottom<=headerHeight)
  // if(bannerBottom<=headerHeight) {
  //   header.classList.add('shadow')
  // }
  // else {
  //   header.classList.remove('shadow')
  // }
  
}

