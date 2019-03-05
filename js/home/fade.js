//沒有用到的輪播
const heroImgWrap = document.querySelector('.hero-image-area')
const heroImg = document.querySelector('.hero-image')
const mainTextWrap = document.querySelector('.main-text')
const subTextWrap = document.querySelector('.sub-text')
const url = 'https://api.appworks-school.tw/api/1.0/marketing/campaigns'
let TopData = []

fetch(url)
.then(res => {
  return res.json()
})
.then(json => {
  TopData = json.data
  heroImg.classList.add('fade') //第一張圖加入漸變
  renderHeroImg(0) //顯示第一張圖與資料
  renderDot(TopData) //渲染點個數
  showCurrentDot(0) //當前點加入樣式
  changeindex() //切換index重新渲染
})
.catch(err=>'error')

//render畫面(資料不動）
function renderHeroImg(id) {
  heroImgWrap.setAttribute('data-index',id)
  mainTextWrap.innerHTML = ''
  subTextWrap.innerHTML = ''
  //圖片
  const productUrl = 
  heroImg.style.backgroundImage = 
  `linear-gradient(90deg,white,transparent 60%), 
  url('http://18.214.165.31${TopData[id].picture}')` 
  //處理文字陣列
  const textArray = TopData[id].story.split(/[\n,]/g)
  const mainTextArray = textArray.slice(0,3)
  const subTextArray = textArray.slice(3)
  //大字
  mainTextArray.forEach(el => {
    const mainText = document.createElement('span')
    mainText.textContent = el
    mainTextWrap.appendChild(mainText)
  })
  //小字
  const subText = document.createElement('span')
  subText.textContent = subTextArray
  subTextWrap.appendChild(subText)
}
//render點點(once）
function renderDot(data) {
  data.forEach((el,index) => {
    const dotWrap = document.querySelector('.dot-wrap')
    const dot = document.createElement('div')
    dot.className='dot'
    dot.setAttribute('data-index',`${index}`)
    dotWrap.appendChild(dot)
  })
}
//顯示當前點點
function showCurrentDot(id) {
  const dotGroup = document.querySelectorAll('.dot')
  dotGroup.forEach(el=>{
    el.classList.remove('active')
    //typeof不同用兩等號
    if(el.dataset.index==id) {
      el.classList.add('active')
    }
  })
}
//點點點擊
function changeindex() {
  const dotGroup = document.querySelectorAll('.dot')
  dotGroup.forEach(el=> el.addEventListener('click',function(){
    const id = el.dataset.index
    showCurrentDot(id)
    renderHeroImg(id)
    clearInterval(interval)
  }))
}
//設定輪播(一開始執行)
let interval= window.setInterval(autoChange, 10000)
//自動變換
function autoChange() {
  let id = heroImgWrap.dataset.index
  id = (id+1+data.length) % 3
  renderHeroImg(id)
  showCurrentDot(id)
  heroImg.classList.remove('fade')
  heroImg.classList.add('fade')
}
//滑進停止
heroImgWrap.addEventListener('mouseover',function(){
  interval = clearInterval(interval)
})
//滑出開始
heroImgWrap.addEventListener('mouseout',function(){
  interval= window.setInterval(autoChange, 10000)
}) 

/*
scss
//hero-image整體
.hero-image-area {
  width: 100%;
  // padding-bottom: calc(140px + 18.75%); //區域高度
  margin-bottom: 3.65%; //與下方section距離
  background-color: #e2e2e2;
  position: relative;
  cursor: pointer;
}
//hero-image圖片
.hero-image {
  size: 100%;
  padding-bottom: calc(140px + 18.75%);
  background-position: center center;
  background-size: cover;
  opacity: 0;
  visibility: hidden;
  transition: 0.4s ease-in;
  &.fade {
    opacity: 1;
    visibility: visible;
  }
}

pug
main.main-container
  .hero-image-area
    .hero-image
*/
