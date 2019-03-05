/*global baseUrl pageTransitionAnimate getCartTotal */

const pcWrap = document.querySelector('.lg-cart-item-group') 
const smWrap = document.querySelector('.sm-cart-item-group')  
const cartContainer = document.querySelector('.cart-inner')
let url = `${baseUrl}/all`
let all = []

// 從資料庫取得商品=>找尋購物車商品庫存=>庫存render在option中=>更改數量
// 合併主頁與分頁的商品=>得到全部的商品陣列=>頁面動作
async function initCart(url) {
  let res = await fetch(url)
  let jsonData = await res.json()
  let realData = jsonData.data
  let paging = jsonData.paging
  realData.forEach(el=>all.push(el))
  if (paging) {
    let u = `${baseUrl}/all?paging=${paging}` 
    initCart(u)
  }
  else {
    const storageData = JSON.parse(localStorage.getItem('product'))
    if(storageData.length===0) {
      noProduct()
      requestAnimationFrame(pageTransitionAnimate)
      return
    }
    console.log(all)
    console.log('f')
    findStock()
    pcRender(storageData)
    mobileRender(storageData)
    requestAnimationFrame(pageTransitionAnimate)
    calcTotalPrice()
    numChange()
    deleteProduct()
    renderCartNum() 
  }
}

initCart(url)
//取得購物車商品庫存的陣列
function findStock() {
  let storageData = JSON.parse(localStorage.getItem('product'))
  //01.用id找到資料庫與購物車相同商品(all)
  let stockArray = storageData.map(el=>all.find(item=>item.id===el.id))
  //02.得到該商品當下尺寸顏色的庫存陣列
  stockArray = stockArray.map(el=>el.variants)
  //03.找到商品庫存並組成陣列
  stockArray = storageData.map((el,index)=>{
    return stockArray[index].find(item=>item.color_code===el.color.code&&item.size===el.size)
  }).map(i=>i.stock)
  return stockArray
}
//有變動時確認庫存並重新渲染option(未完成)
// function renderStock() {
//   const storage = JSON.parse(localStorage.getItem('product'))
//   const stock = findStock() 
//   const qty = storage.map(el=>el.qty)
//   const pcSelect = document.querySelectorAll('.lg-select')
//   const mbSelect = document.querySelectorAll('.sm-select')
//   pcSelect.forEach((el,index)=>{
//     createOption(stock,index,qty[index],el)
//   })
//   mbSelect.forEach((el,index)=>{
//     createOption(stock,index,qty[index],el)
//   })
// }

//創建數量option
function createOption(array,index,qty,parent) {
  for(let i=1;i<=array[index];i++) {
    const option = document.createElement('option')
    option.setAttribute('value',i)
    option.setAttribute('name',i)
    option.textContent = i
    parent.appendChild(option)
    if(i===qty) option.setAttribute('selected','selected')
  } 
}

//電腦模板
function pcRender(data) {
  data.forEach((el,index)=> {
    //整個商品
    const productWrap = document.createElement('div')
    productWrap.className = 'cart-product-item lg-cart-product-item'
    productWrap.id = el.uniqueId
    //左邊區塊
    const leftPart = document.createElement('div')
    leftPart.className = 'cart-item-left-info'
    //商品圖
    const img = document.createElement('img')
    img.className = 'cart-item-photo'
    img.setAttribute('src',`${el.img}`)
    //商品細節文字
    const mainText = document.createElement('div')
    mainText.className = 'cart-item-text'
    //商品標題
    const title = document.createElement('div')
    title.className = 'cart-item-title'
    title.textContent = el.name
    //商品編號
    const number = document.createElement('div')
    number.className = 'cart-item-number'
    number.textContent = el.id
    //顏色
    const color = document.createElement('div')
    color.className = 'cart-item-color'
    color.textContent = `顏色 | ${el.color.name}`
    //尺寸
    const size = document.createElement('div')
    size.className = 'cart-item-size'
    size.textContent = `尺寸 | ${el.size}`
    //細節文字串接
    mainText.appendChild(title)
    mainText.appendChild(number)
    mainText.appendChild(color)
    mainText.appendChild(size)
    //左邊區域串接
    leftPart.appendChild(img)
    leftPart.appendChild(mainText)
    //數量
    const num = document.createElement('div')
    num.className = 'cart-item-num lg-cart-item-num'
    //數量選擇區
    const styleSelect = document.createElement('div')
    styleSelect.className = 'style-select'
    const select = document.createElement('select')
    select.className = 'lg-select'
    select.id = el.uniqueId
    createOption(findStock(),index,el.qty,select) 
    //數量串接
    num.appendChild(styleSelect)
    styleSelect.appendChild(select)
    //商品價格
    const price = document.createElement('div')
    price.className = 'cart-item-price lg-cart-item-price'
    price.textContent = `NT.${el.price}`
    //商品總價
    const total = document.createElement('div')
    total.className = 'cart-item-total lg-cart-item-total'
    total.id = el.uniqueId
    total.textContent = `NT.${el.price * el.qty}`
    //刪除按鈕
    const deleteBtn = document.createElement('div')
    deleteBtn.className = 'cart-item-delete lg-cart-item-delete'
    deleteBtn.id = el.uniqueId
    const deleteImg = document.createElement('i')
    deleteImg.className='delete-target fas fa-trash-alt'
    deleteImg.id = el.uniqueId
    deleteBtn.appendChild(deleteImg)
    //整體串接
    productWrap.appendChild(leftPart)
    productWrap.appendChild(num)
    productWrap.appendChild(price)
    productWrap.appendChild(total)
    productWrap.appendChild(deleteBtn)
    pcWrap.appendChild(productWrap)
  })
}
//手機模板
function mobileRender(data) {
  data.forEach((el,index)=> {
    //整個商品
    const productWrap = document.createElement('div')
    productWrap.className = 'cart-product-item sm-cart-product-item'
    productWrap.id = el.uniqueId
    //上區塊
    const topPart = document.createElement('div')
    topPart.className = 'cart-item-top-info'
    //商品圖
    const img = document.createElement('img')
    img.className = 'cart-item-photo'
    img.setAttribute('src',`${el.img}`)
    //商品細節文字
    const mainText = document.createElement('div')
    mainText.className = 'cart-item-text'
    //商品標題
    const title = document.createElement('div')
    title.className = 'cart-item-title'
    title.textContent = el.name
    //商品編號
    const number = document.createElement('div')
    number.className = 'cart-item-number'
    number.textContent = el.id
    //顏色
    const color = document.createElement('div')
    color.className = 'cart-item-color'
    color.textContent = `顏色 | ${el.color.name}`
    //尺寸
    const size = document.createElement('div')
    size.className = 'cart-item-size'
    size.textContent = `尺寸 | ${el.size}`
    //細節文字串接
    mainText.appendChild(title)
    mainText.appendChild(number)
    mainText.appendChild(color)
    mainText.appendChild(size)
    //刪除按鈕
    const deleteBtn = document.createElement('div')
    deleteBtn.className = 'cart-item-delete sm-cart-item-delete'
    deleteBtn.id = el.uniqueId
    const deleteImg = document.createElement('i')
    deleteImg.className='delete-target fas fa-trash-alt'
    deleteImg.id = el.uniqueId
    deleteBtn.appendChild(deleteImg)
    
    //上方區域串接
    topPart.appendChild(img)
    topPart.appendChild(mainText)
    topPart.appendChild(deleteBtn)
    //下方區塊
    const bottomPart = document.createElement('div')
    bottomPart.className = 'cart-item-bottom-info'
    //下方標題區塊
    const textBottomBlock = document.createElement('div')
    textBottomBlock.className = 'cart-item-bottom-block'
    //數量文
    const numText = document.createElement('div')
    numText.className = 'cart-item-bottom-title'
    numText.textContent = '數量'
    //單價文
    const priceText = document.createElement('div')
    priceText.className = 'cart-item-bottom-title'
    priceText.textContent = '單價'
    //總價文
    const totalText = document.createElement('div')
    totalText.className = 'cart-item-bottom-title'
    totalText.textContent = '小計'
    //下方標題串接
    textBottomBlock.appendChild(numText)
    textBottomBlock.appendChild(priceText)
    textBottomBlock.appendChild(totalText)
    //下方值區塊
    const valueBottomBlock = document.createElement('div')
    valueBottomBlock.className = 'cart-item-bottom-block'
    //數量值
    const numValue = document.createElement('div')
    numValue.className = 'cart-item-num cart-item-bottom-value'
    //數量選擇區
    const styleSelect = document.createElement('div')
    styleSelect.className = 'style-select'
    const select = document.createElement('select')
    select.className = 'sm-select'
    select.id = el.uniqueId
    createOption(findStock(),index,el.qty,select) 
    //數量串接
    numValue.appendChild(styleSelect)
    styleSelect.appendChild(select)
    //商品價格
    const priceValue = document.createElement('div')
    priceValue.className = 'cart-item-price cart-item-bottom-value'
    priceValue.textContent = `NT.${el.price}`
    //商品總價
    const total = document.createElement('div')
    total.className = 'cart-item-total cart-item-bottom-value'
    total.textContent = `NT.${el.price * el.qty}`
    total.id = el.uniqueId
    //下方值串接
    valueBottomBlock.appendChild(numValue)
    valueBottomBlock.appendChild(priceValue)
    valueBottomBlock.appendChild(total)
    //下方整體串接
    bottomPart.appendChild(textBottomBlock)
    bottomPart.appendChild(valueBottomBlock)
    //整體串接
    productWrap.appendChild(topPart)
    productWrap.appendChild(bottomPart)
    smWrap.appendChild(productWrap)
  })
}

function noProduct() {
  const empty = document.createElement('div')
  empty.textContent = '您的購物車是空的'
  empty.className = 'empty-cart'
  cartContainer.innerHTML = ''
  cartContainer.appendChild(empty)
}


//變更數量
function numChange() {
  const select = document.querySelectorAll('select')
  select.forEach(input=>input.addEventListener('change',function(){
    let value = input.value
    //同步電腦與手機的select值
    select.forEach(item=>{
      if(select.id===item.id&&select!==item) item.value=input.value 
    })
    //取得購物車資料並將更改的資料回傳
    let cart = JSON.parse(localStorage.getItem('product'))
    cart.forEach(item=>{
      if(item.uniqueId==input.id) item.qty = parseInt(value)  
    })
    localStorage.setItem('product',JSON.stringify(cart))
    udpatePrice(input.id)
    calcTotalPrice()
    getCartTotal()
    renderCartNum() 
  }))
}

//更新單個商品總價
function udpatePrice(id) {
  const cart = JSON.parse(localStorage.getItem('product'))
  const total = Array.from(document.querySelectorAll('.cart-item-total'))
  const updateItem = total.filter(el=>el.id===id)

  updateItem.forEach(el=>{
    cart.forEach(item=>{
      if(el.id===item.uniqueId) {
        el.textContent = `NT.${item.price * item.qty}`
      }
    })
  })
}
// 刪除商品
function deleteProduct() {
  const deleteBtn = document.querySelectorAll('.delete-target')
  const product = document.querySelectorAll('.cart-product-item')
  deleteBtn.forEach(el=>el.addEventListener('click',deleteHandler))
  function deleteHandler(e) {
    //陣列刪除
    let cart = JSON.parse(localStorage.getItem('product'))
    cart = cart.filter(el=>el.uniqueId!==e.target.id)
    localStorage.setItem('product',JSON.stringify(cart))
    //畫面刪除
    product.forEach(el=>{
      if(el.id===e.target.id) el.parentNode.removeChild(el)
    })
    calcTotalPrice()
    getCartTotal()
    renderCartNum() 
    let afterDelete = JSON.parse(localStorage.getItem('product'))
    if(afterDelete.length===0) noProduct()
  }
}
// 計算總價
let productPrice = null
let deliveryPrice = 0
let totalPrice = null

function calcTotalPrice() {
  let cart = JSON.parse(localStorage.getItem('product'))
  if(cart.length===0) return
  const productTotal = document.querySelector('.product-total-price')
  const deliveryPay = document.querySelector('.product-delivery-price')
  const payTotal = document.querySelector('.pay-sumup')
  productPrice = cart.map(el=>el.price*el.qty)
  deliveryPrice = 0
  productPrice = productPrice.reduce((acc,cur)=>acc+cur)
  if(productPrice>2000) deliveryPrice = 0
  else deliveryPrice = 30
  totalPrice = productPrice + deliveryPrice 
  productTotal.textContent = productPrice
  deliveryPay.textContent = deliveryPrice
  payTotal.textContent = totalPrice
}


function renderCartNum() {
  let data = JSON.parse(localStorage.getItem('product'))
  if(data.length===0) return 
  let cartNum = document.querySelectorAll('.cart-main-title')
  data = data.map(el=>el.qty)
  data = data.reduce((acc,cur)=>acc+cur)
  cartNum.forEach(el=>el.textContent = `購物車(${data})`)
}








