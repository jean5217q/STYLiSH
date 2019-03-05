//設置locakstorage
if(!localStorage.getItem('product')) {
  let storage = []
  localStorage.setItem('product',JSON.stringify(storage))
}

const baseUrl = 'https://api.appworks-school.tw/api/1.0/products'
let cataUrl = null
let query = window.location.search //含問號之後
let path = window.location.pathname //資料夾
const container = document.querySelector('.main-container') // 頁面初始化loader父層
const body = document.querySelector('body')
const starterLoader = document.querySelector('.page-load-container')

// 首頁=>/
// 類別=>?category=
// 搜尋=>?search?

// 帶參數情況=>複用模板(類別/搜索)(單一商品)
if(query) {
  if(query.indexOf('?search?keyword=')!==-1) {
    if(path!=='/') window.location.pathname='/' 
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

//頁面初始
function pageInit() {
  getCartTotal()
}
pageInit()

// -----header相關控制項-----//
// 切換active類別CSS樣式
const allLink = document.querySelectorAll('.js-link')
const allIndicator = document.querySelectorAll('.nav-indicator')
allLink.forEach(el=>{
  if(el.dataset.cata===cataUrl) el.classList.add('active')  
})
allIndicator.forEach(el=>{
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


//滑鼠搜尋
form.forEach(el=>el.addEventListener('submit',searchHandler))
//鍵盤搜尋
// document.addEventListener('keypress',function(evt){
//   if(evt.keyCode === 13 || evt.which === 13){
//     searchHandler(evt)
//   } 
// })
//搜索
function searchHandler(e) {
  e.preventDefault()
  let search = null
  input.forEach(el => {
    if(el.value) search = el.value.trim()
  })
  if(!search) return
  window.location.href = `index.html?search?keyword=${search}`
  input.forEach(el => el.value = '')
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
  if(!isLogin) {
    numWrap.forEach(el=>el.classList.remove('show'))
  }
  else {
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
}

//-----loader相關-----//
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
let transOpacity = 1
function pageTransitionAnimate() {
  const transLayout = document.querySelector('.transition-layout')
  transOpacity = transOpacity-0.03
  transLayout.style.opacity = `${transOpacity}`
  if(transOpacity<0) {
    transLayout.style.display = 'none'
    return
  }
  requestAnimationFrame(pageTransitionAnimate)
}



const header = document.querySelector('.lg-header')
const decorationBar = document.querySelector('.lg-header-decoration')
// const banner = document.querySelector('.hero-image-wrap')
window.addEventListener('scroll',headerHander)

function headerHander(e){
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


// const logo = document.querySelector('.lg-header-logo')
// logo.addEventListener('click',function(e) {
//   e.preventDefault()
//   starterLoader.style.display = 'none'
//   window.location.href = '/'
//   console.log('f')
// })
