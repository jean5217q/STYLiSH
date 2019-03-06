/* global initUrl pageTransitionAnimate query getCartTotal body*/


  container.style.opacity=1
  createMobileLoader()

fetchHandler(initUrl)
async function fetchHandler(url) {
  // ajax
  const res = await fetch(url)
  const json = await res.json()
  const data = json.data
  const variants = data.variants
  removeMobileLoader()
  render(data)
  if(WinWidth>575) requestAnimationFrame(pageTransitionAnimate)
  cartHandler(variants,data) 
}

// 頁面模板
function render(data) {
  //主圖
  const mainImg = document.querySelector('.product-img')
  mainImg.style.backgroundImage = `url('${data.main_image}')` 
  //產品名
  const title = document.querySelector('.product-main-head')
  title.textContent = data.title
  //產品編號
  const number = document.querySelector('.product-number')
  number.textContent = data.id
  //產品價格
  const price = document.querySelector('.product-price')
  price.textContent = `TWD.${data.price}`
  //color
  const productColorGroup = document.querySelector('.colorr-select')
  data.colors.forEach(el=>{
    //顏色外框
    const colorBlock = document.createElement('a')
    colorBlock.className = 'product-color'
    colorBlock.setAttribute('data-type',el.code)
    colorBlock.setAttribute('data-name',el.name)
    //顏色內框
    const colorInner = document.createElement('div')
    colorInner.className = 'product-color-inner'
    colorInner.style.backgroundColor = `#${el.code}`
    colorInner.setAttribute('data-type',el.code)
    colorInner.setAttribute('data-name',el.name)
    //串接色塊群
    colorBlock.appendChild(colorInner)
    productColorGroup.appendChild(colorBlock)
  })
  //size
  const sizeGroup = document.querySelector('.size-select')
  data.sizes.forEach(el=>{
    //尺寸外框
    const sizeBlock = document.createElement('a')
    sizeBlock.className = 'product-size'
    sizeBlock.setAttribute('data-type',el)
    //尺寸文字
    const sizeText = document.createElement('span')
    sizeText.textContent = el
    sizeText.setAttribute('data-type',el)
    //串接尺寸群
    sizeBlock.appendChild(sizeText)
    sizeGroup.appendChild(sizeBlock)
  })
  // 說明文字－以～為主區域
  const info = document.querySelector('.product-notice span')
  info.textContent = `*${data.note}`
  // 材料
  const texture = document.querySelector('.texture')
  texture.textContent = data.texture
  // 厚薄
  const thick = document.querySelector('.thick')
  thick.textContent = `${data.description.split(/[\n,]/g)[0]}`
  // 彈性
  const flexible = document.querySelector('.flexible')
  flexible.textContent = `${data.description.split(/[\n,]/g)[1]}`
  // 材質群組串接
  const material = document.querySelector('.product-texture')
  material.appendChild(texture)
  material.appendChild(thick)
  material.appendChild(flexible)
  // 材質產地
  const texturePlace = document.querySelector('.texture-place')
  texturePlace.textContent = `素材產地 / ${data.place}`
  // 加工地
  const madePlace = document.querySelector('.made-place')
  madePlace.textContent = `加工產地 / ${data.place}`
  //地點群組串接
  const place = document.querySelector('.product-made')
  place.appendChild(texturePlace)
  place.appendChild(madePlace)

  //說明文字
  data.images.forEach(el=>{
    //說明區域框
    const descriptionBlock = document.createElement('div')
    descriptionBlock.className = 'detail-block'
    //說明文
    const descText = document.createElement('p')
    descText.textContent = data.story
    //說明圖
    const descPhoto = document.createElement('img')
    descPhoto.className = 'detail-photo'
    descPhoto.setAttribute('src',el)
    //說明區域串接
    descriptionBlock.appendChild(descText)
    descriptionBlock.appendChild(descPhoto)
    const description = document.querySelector('.detail-content')
    description.appendChild(descriptionBlock)
  })

  
}


/-----購物車-----/
function cartHandler(variants,data){
  let control = {
    color_code: null,
    size: null
  }
  let colorName = null //顏色名
  let isClick = false //控制是否可以加減
  const colorGroup = document.querySelectorAll('.product-color') //所有顏色選項
  const sizeGroup = document.querySelectorAll('.product-size') //所有尺寸選項
  const inputNum = document.querySelector('.num-total') //數量輸入欄
  const Numbox = document.querySelector('.product-num-box') //數量輸入欄外框
  const plusBtn = document.querySelector('.num-plus') //加按鈕
  const minusBtn = document.querySelector('.num-minus') //減按鈕
  const cartBtn = document.querySelector('.add-cart-btn') //購物車按鈕
  const warn = document.querySelector('.num-warn-text') //警示語

  let stock = variants //商品所有規格資訊 
  let outOfStock = [] //零庫存組合 
  let stockNum = null //單個商品庫存量
  let chooseNum = parseInt(inputNum.value) //消費者選擇數量

  //所有按鍵監聽事件
  colorGroup.forEach(el=>el.addEventListener('click', colorClick))
  sizeGroup.forEach(el=>el.addEventListener('click', sizeClick))
  inputNum.addEventListener("keyup", inputChange)
  minusBtn.addEventListener('click',minusHandler)
  plusBtn.addEventListener('click',plusHandler)
  
  //顏色按鈕
  function colorClick(e) {
    const $this = e.currentTarget
    Selectstyle(colorGroup,$this,'color_code')
    getStock() 
    checkOutOfStock()
    outOfStockHandler(sizeGroup,$this,'color_code','size',sizeClick)
    disableHandler()
    inputNum.focus()
    colorName = $this.dataset.name
  }
  //數量按鈕
  function sizeClick(e) {
    const $this = e.currentTarget
    Selectstyle(sizeGroup,$this,'size')
    getStock() 
    checkOutOfStock()
    outOfStockHandler(colorGroup,$this,'size','color_code',colorClick)
    disableHandler()
    inputNum.focus()
  }
  //處理缺貨(切換樣式/切換監聽事件)
  function outOfStockHandler(group,target,type,soldOutType,clickFunc) {
    //恢復預設值
    group.forEach(btn=> {
      btn.classList.remove('sold-out')
      btn.firstChild.style.cursor='pointer'
      btn.addEventListener('click',clickFunc)
    })
    if(!control[type]) return 
    const typeFilter = 
    outOfStock.filter(item=>item[type]===target.dataset.type)
    .map(item=>item[soldOutType])
    typeFilter.forEach(typeCode=>{
      group.forEach(btn=>{
        if(btn.dataset.type===typeCode) {
          btn.classList.add('sold-out')
          btn.firstChild.style.cursor='not-allowed'
          btn.removeEventListener('click',clickFunc)
        }
      })
    })
  }
  //輸入數字
  function inputChange() {
    if(inputNum.value<=0||isNaN(inputNum.value)) inputNum.value=1
    chooseNum = inputNum.value
    disableHandler()
  }
  //取得類別庫存數
  function getStock() {
    if(control.size&&control.color_code) {
      const stockGroup = stock.find(el=>{
        return el.size===control.size&&el.color_code===control.color_code
      })
      stockNum=stockGroup.stock
    }
  }
  //無庫存的組合
  function checkOutOfStock() {
    outOfStock = stock.filter(el=>el.stock===0)
  }
  //減  
  function minusHandler() {
    chooseNum = chooseNum-1 
    if(!isClick || chooseNum<=0) {
      chooseNum = 1
      inputNum.value = chooseNum 
    }
    else {
      inputNum.value = chooseNum
      disableHandler()
    } 
  }
  //加
  function plusHandler() {
    if(!isClick || chooseNum === stockNum) return 
    chooseNum = chooseNum+1
    inputNum.value = chooseNum
    disableHandler()  
  }
  //判斷是否點選顏色框導入商品頁
  function colorQueryHandler(){
    if(query.indexOf('color')!==-1) {
      const searchColor = query.split('&')[1].split('=')[1]
      control.color_code = searchColor
      colorGroup.forEach(el=>{
        if(el.dataset.type===searchColor) {
          el.classList.add(`js-select-color_code`)
        }
      })
    }  
  }
  colorQueryHandler()
  //切換選項CSS
  function Selectstyle(group,target,type) {
    console.log('d')
    group.forEach(el=>el.classList.remove(`js-select-${type}`))
    if(control[type]===target.dataset.type) {
      target.classList.remove(`js-select-${type}`)
      control[type] = null
    }
    else {
      target.classList.add(`js-select-${type}`)
      control[type] = target.dataset.type 
    }
  }
  //禁用控制項
  function disableHandler() {
    if(control.size&&control.color_code) {
      inputNum.disabled = false
      Numbox.classList.remove('disabled')
      cartBtn.classList.remove('disabled')
      isClick =true
      if(chooseNum > stockNum) {
        warn.classList.add('showWarn')
        warn.querySelector('span').textContent = '您填寫的商品數量超過庫存'
        cartBtn.classList.add('disabled')
      }
      else {
        warn.classList.remove('showWarn')
        cartBtn.classList.remove('disabled')
      }
    }
    else {
      inputNum.disabled = true
      isClick = false
      Numbox.classList.add('disabled')
      cartBtn.classList.add('disabled')
      warn.classList.remove('showWarn')
    }
  } 
  
  //提交按鈕
  const form = document.querySelector('.submit-form')
  form.addEventListener('submit',addToCartHandler)
  //加入購物車
  function addToCartHandler(e) {
    e.preventDefault()
    if(cartBtn.classList.contains('disabled')) return 
    warn.classList.remove('showWarn')
    const addItem = itemObj(data,colorName,control,chooseNum)
    const checkArray = JSON.parse(localStorage.getItem('product'))
    console.log(checkArray)
    //找尋是否已加入購物車(id/size/color)
    if(checkArray) {
      let item = checkArray.find(
        el=>el.size===addItem.size&&
        el.color.name===addItem.color.name&&el.id===addItem.id)
      let itemId = checkArray.findIndex(el=>el===item)
      //如果已經加入要判斷庫存
      if(item) {
        //找到重複項目的庫存數
        let originItem = 
        stock.filter(el=>el.size===item.size)
        originItem = originItem.find(el=>el.color_code===item.color.code)
        let itemStock = originItem.stock
        //新項目數量加原始數量大於庫存不加入
        if(addItem.qty+item.qty>itemStock) {
          warn.classList.add('showWarn')
          warn.querySelector('span').textContent = '商品加購件數(含已加入)已超過庫存'
        }
        //新項目數量加原始數量小於或等於總庫存=>更新資料
        else {
          console.log('update')
          checkArray[itemId].qty=addItem.qty+item.qty
          localStorage.setItem('product',JSON.stringify(checkArray))
        } 
      }
      //沒有加入過直接推入
      else {
        checkArray.push(addItem)
        localStorage.setItem('product',JSON.stringify(checkArray))
        console.log('add')
      }
    }
    else {
      const array = []
      array.push(addItem)
      localStorage.setItem('product',JSON.stringify(array))
    } 
    getCartTotal()
    showCartPopUp(data)
  }
  //傳送商品物件格式
  function itemObj(data,colorName,control,quantity) {
    return {
      uniqueId: data.id+control.color_code+control.size,
      img: data.main_image,
      id: data.id,
      name: data.title,
      price: data.price,
      color: {
        name: colorName,
        code: control.color_code,
      },
      size: control.size,
      qty: quantity
    }
  }
  //成功加入購物車popup
  const popContainer = document.querySelector('.cart-popup-container')
  function showCartPopUp(data) {
    const popTitle = document.querySelector('.js-cart-popup-text-title')
    const popColor = document.querySelector('.js-cart-popup-text-color')
    const popSize = document.querySelector('.js-cart-popup-text-size')
    const popPhoto = document.querySelector('.cart-popup-photo')
    popTitle.innerHTML = data.title
    popColor.textContent = `顏色 | ${colorName}`
    popSize.textContent = `尺寸 | ${control.size}`
    popPhoto.style.backgroundImage = `url('${data.main_image}')` 
    if(window.innerWidth > 767) {
      console.log(window.innerWidth)
      body.style.overflow = 'hidden'
      popContainer.style.display = 'block'
    }
  }
  const popBackground = document.querySelector('.cart-popup-background')
  const popCross = document.querySelector('.cart-popup-close-btn')
  popBackground.addEventListener('click',closePopHandler)
  popCross.addEventListener('click',closePopHandler)
  window.onresize = closePopHandler
  function closePopHandler() {
    popContainer.style.display = 'none'
    body.style.overflow = 'visible'
  }

}
