let WarnNumber = document.querySelector('.card-number-warm') //卡號
let WarmExpiration = document.querySelector('.card-expiration-warm')//到期日
let WarnCcv = document.querySelector('.card-ccv-warm') //ccv
const payBtn = document.querySelector('.pay-btn') //付款按鈕(控制樣式)
const allFormInput = document.querySelectorAll('.order-input')
let FoemDataReady = false //表格資訊是否完整 
let CardReady = false
let orderTime = null
let orderNumber = null

if(!localStorage.getItem('order')) {
  localStorage.setItem('order',JSON.stringify([]))
}
// 測試卡號 4242424242424242
// 測試日期 01/23
// CCV 123

//初始化
TPDirect.setupSDK(12348, "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF", "sandbox")
TPDirect.card.setup({
  // 設置信用卡placeholder
  fields: {
      number: {
          element: '#card-number',
          placeholder: '**** **** **** ****'
      },
      expirationDate: {
          element: '#card-expiration-date',
          placeholder: 'MM / YY'
      },
      ccv: {
          element: '#card-ccv',
          placeholder: '後三碼'
      }
  },
  //設置input框字型ok warm
  styles: {
    'input': {
        'color': '#222'
    },
    'input.cvc': {
        'font-size': '1em'
    },
    'input.expiration-date': {
        'font-size': '1em'
    },
    'input.card-number': {
        'font-size': '1em'
    },
    '.valid': {
        'color': 'green'
    },
    '.invalid': {
        'color': 'red'
    },
  }
})

//status =2(wrong) status=0(correct) 
TPDirect.card.onUpdate(function (update) {
  if (update.canGetPrime) {
    CardReady = true
    checkPayBtn()
  } 
  else {
    CardReady = false
    checkPayBtn()
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  if (update.cardType === 'visa') {
      // Handle card type visa.
  }
  if (update.status.number === 2) {
      WarnNumber.textContent = '請輸入正確的卡號'
  } else if (update.status.number === 0) {
      WarnNumber.textContent = ''
  } else {
      WarnNumber.textContent = ''
  }
  if (update.status.expiry === 2) {
      WarmExpiration.textContent = '請輸入有效日期'
  } else if (update.status.expiry === 0) {
      WarmExpiration.textContent = ''
  } else {
      WarmExpiration.textContent = ''
  }

  if (update.status.cvc === 2) {
      WarnCcv.textContent = '請輸入卡片背後三碼'
  } else if (update.status.cvc === 0) {
      WarnCcv.textContent = ''
  } else {
      WarnCcv.textContent = ''
  }
})

//限用卡資訊取得授權
function onSubmit() {
  const tappayStatus = TPDirect.card.getTappayFieldsStatus()
  if (tappayStatus.canGetPrime === false) {
      // alert('can not get prime')
      return
  }
  TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
          // alert('get prime error ' + result.msg)
          return
      }
      // alert('get prime 成功，prime: ' + result.card.prime)
      const postObj = getUserDetail(result.card.prime)
      postProductInfo(postObj) 
  })
}




//付款控制
const Payform = document.querySelector('.pay-area')
Payform.addEventListener('submit',payHandler)

function payHandler(e) {
  e.preventDefault()
  ckeckInputData()
  if(!FoemDataReady) return
  onSubmit()
  getTime()
  localStorage.setItem('product',JSON.stringify([]))
}

//post 資料
function getUserDetail(key) {
  const deliveryCountry = document.querySelector('select.country').value
  const deliveryWay = document.querySelector('select.payway').value
  const consumer = document.querySelector('#name').value
  const phone = document.querySelector('#phone').value
  const email = document.querySelector('#email').value
  const address = document.querySelector('#address').value
  const deliverTime = getRadioButtonCheckedValue()
  const cartList = reArrangeData()
  return {
    prime: key,
    order: {
      shipping: deliveryCountry,
      payment: "credit_card",
      subtotal: productPrice,
      freight: deliveryPrice,
      total: totalPrice,
      recipient: {
        name: consumer,
        phone: phone,
        email: email,
        address: address,
        time: deliverTime
      },
      list: cartList
    }
  }
}
//整理購物車陣列
function reArrangeData() {
  const cartData = JSON.parse(localStorage.getItem('product'))
  const arrangeData = cartData.map(el=>{
    return {
      id: el.id,
      name: el.name,
      price:el.price,
      color: {
        name: el.color.name,
        code: el.color.code
      },
      size: el.size,
      qty: el.qty
    }
  })
  return arrangeData
}
// 取得單選值
function getRadioButtonCheckedValue(){
  const radio = document.querySelectorAll('.radio-input')
  let radioValue = ''
  radio.forEach(el=>{
    if(el.checked) {
      radioValue = el.value
    }
  })
  return radioValue
}
//確認輸入資料(尚未加入regex)
function ckeckInputData() {
  const consumer = document.querySelector('#name').value
  const phone = document.querySelector('#phone').value
  const email = document.querySelector('#email').value
  const address = document.querySelector('#address').value
  if(consumer==='') {
    FoemDataReady = false
    return
  }
  if(!phone.match(/^09\d{8}$/)) {
    FoemDataReady = false
    return
  }
  if(email==='') {
    FoemDataReady = false
    return
  }
  if(address==='') {
    FoemDataReady = false
    return
  }
  FoemDataReady = true
}



//發送訂單資料並取回訂單編號
function postProductInfo(obj) {
  const url = `https://api.appworks-school.tw/api/1.0/order/checkout`
  fetch(url,{
    method: 'Post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  })
  .then(res=>res.json())
  .then(json=>{
    orderNumber=json.data.number
    console.log(orderNumber)
    const orderObj = {
      time: orderTime,
      number: orderNumber,
      price: totalPrice
    }

    let arr = JSON.parse(localStorage.getItem('order'))
    console.log(arr)
    arr.push(orderObj)
    localStorage.setItem('order',JSON.stringify(arr))
    window.location.href = `./pay.html`
  })
}


allFormInput.forEach(el=>el.addEventListener('keyup',checkPayBtn))

function checkPayBtn() {
  ckeckInputData() 
  if(FoemDataReady&&CardReady) {
    payBtn.classList.remove('disabled')
    Payform.addEventListener('submit',payHandler)
  }
  else {
    payBtn.classList.add('disabled')
    Payform.removeEventListener('submit',payHandler)
  }
}

function getTime() {
  const now = new Date()
  const year = now.getFullYear() 
  const month = now.getMonth()+1
  const date = now.getDate()
  const hour = now.getHours()
  let minute = now.getMinutes()
  if(minute<10) minute = `0${minute}`
  console.log(minute)
  orderTime = `${year}/${month}/${date} ${hour}:${minute}`
}

getTime()

