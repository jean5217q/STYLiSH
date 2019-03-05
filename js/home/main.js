let pagingUrl = null //滾動fetch網址
let isScroll = true //是否滾動
const productWrap = document.querySelector('.home-product-group-inner') //商品清單父層
const windowHeight = document.documentElement.clientHeight //視窗高度
//window.innerHeight也可

//初始化
function pageInit() {
  fetchHandler(initUrl)
}
pageInit()

async function fetchHandler(url) {
  // ajax
  const res = await fetch(url)
  const json = await res.json()
  const paging = json.paging
  const data = json.data
  console.log(data)
  // 畫面
  clearLoader()
  data.length===0 ? renderNone() : render(data)
  requestAnimationFrame(pageTransitionAnimate)
  if(paging) {
    isScroll = true
    pagingUrl = `${baseUrl}/${cataUrl}?paging=${paging}`
    window.addEventListener('scroll',pagingHandler)
  }
  else pagingUrl = null 
}

//分頁加載
function pagingHandler() {
  const bottom = document.querySelector('footer').getBoundingClientRect()
  const top = bottom.top
  if(!isScroll) return
  else if(top < windowHeight) {
    productWrap.appendChild(createLoader())
    fetchHandler(pagingUrl,cataUrl)
    isScroll = false
  }
}

//單一商品模板
function render(data) {
  data.forEach(el=> {
    //個別商品
    let item = document.createElement('div')
    item.className = 'home-product'
    //a連結
    let imgLink = document.createElement('a')
    imgLink.setAttribute('href',`./product.html?id=${el.id}`)
    imgLink.className = 'home-product-img-wrap'
    imgLink.id = `${el.id}`
    //商品圖
    let itemImg = document.createElement('img')
    itemImg.className = 'home-product-img'
    itemImg.style.backgroundImage = `url('${el.main_image}')` 
    imgLink.appendChild(itemImg)
    //顏色組
    let colorGroup = document.createElement('div')
    colorGroup.className = 'color-group'
    //顏色框
    el.colors.forEach(color=> {
      let colorBlock = document.createElement('a')
      colorBlock.className = 'color-block'
      colorBlock.style.backgroundColor = `#${color.code}`
      colorBlock.setAttribute('href',`/product.html?id=${el.id}&color=${color.code}`) 
      colorGroup.appendChild(colorBlock)
    })
    //商品標籤
    let itemTitle = document.createElement('div')
    itemTitle.className = 'home-product-title'
    itemTitle.textContent = el.title
    //商品價格
    let itemPrice = document.createElement('div')
    itemPrice.className = 'home-product-price'
    itemPrice.textContent = `TWD.${el.price}` 
    //串接
    productWrap.appendChild(item)
    item.appendChild(imgLink)
    item.appendChild(colorGroup)
    item.appendChild(itemTitle)
    item.appendChild(itemPrice)
  })
}

// 無符合模板
function renderNone() {
  const matchNone = document.createElement('div')
  matchNone.className = 'no-data'
  matchNone.textContent = '查無符合結果'
  productWrap.appendChild(matchNone)
}

