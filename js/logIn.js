/* exported res */
/* global FB getCartTotal*/
let fBaccessToken = null
let isLogin = false
//電腦
const drop = document.querySelector('.dropdown-list')
const logInBtn = document.querySelector('.header-user-login')
const userPhoto = document.querySelector('.header-user-photo')
const logOutBtn = document.querySelector('.to-logout-btn')
//手機
const smLogInBtn = document.querySelector('.sm-header-user-login')
const smMemberBtn = document.querySelector('.sm-header-user-member')

//檢查當前狀態(載入網頁時與按下登入時)
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response)
  })
}

//依據狀態執行事件
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    fBaccessToken = response.authResponse.accessToken
    isLogin = true
    const user = {
      "provider":"facebook",
      "access_token": fBaccessToken
    }
    Userfetch(user,response)
    afterLogInEventHandler(response)  
  } 
  else {
    isLogin = false
    beforeLogInEventHandler(response)
  }
  renderLogStatusHander()
  getCartTotal() //登入fb才會顯示數量
}

//發送訂單資料並取回訂單編號
function Userfetch(obj) {
  const url = `https://api.appworks-school.tw/api/1.0/user/signin`
  fetch(url,{
    method: 'Post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  })
  .then(res=>res.json())
  .then(json=>{
    const user = json.data.user
    const {name,email,picture} = user
    userPhoto.style.backgroundImage = `url(${picture})`
    const userInfo = {
      name: name,
      email: email,
      photo: picture
    }
    localStorage.setItem('user',JSON.stringify(userInfo))
  })
}


//依據isLogin值判斷render的按鈕
function renderLogStatusHander() {
  if(isLogin) {
    logInBtn.style.display = 'none'
    smLogInBtn.style.display = 'none'
    userPhoto.style.display = 'block'
    smMemberBtn.style.display = 'flex'
  }
  else {
    logInBtn.style.display = 'block'
    smLogInBtn.style.display = 'flex'
    userPhoto.style.display = 'none'
    drop.style.display = 'none'
    smMemberBtn.style.display = 'none'
  }
}


//沒有登入時會有的動作
function beforeLogInEventHandler() {
  logInBtn.addEventListener('click',logInHandler)
  smLogInBtn.addEventListener('click',logInHandler)
  function logInHandler() {
    FB.login(function(){
      checkLoginState()
    },{ scope: 'email,public_profile'})
  }
}


//登入facebook後會有的操作
function afterLogInEventHandler(res) {
  //電腦螢幕hover導覽列
  userPhoto.addEventListener('mouseenter',showDropList)
  drop.addEventListener('mouseenter',showDropList)
  drop.addEventListener('mouseleave',hideDropList)
  function showDropList(){
    drop.style.display = 'block'
  }
  function hideDropList(){
    drop.style.display = 'none'
  }
  //登出按鈕
  const smLogOutBtn = document.querySelector('.sm-user-logout')
  if(smLogOutBtn) {
    smLogOutBtn.addEventListener('click',logOutHandler)
  }
  logOutBtn.addEventListener('click',logOutHandler)
  function logOutHandler() {
    if(res.status==='connected') { 
      FB.api(`/me/permissions`,"DELETE",function(res) {
        console.log(res)
      }) 
      FB.logout(function () {  
        isLogin = false
        renderLogStatusHander()
        beforeLogInEventHandler()
        let path = window.location.pathname
        if(path.indexOf('/profile.html')!==-1) {
          window.location.href = `index.html?category=all`
        }
      })
    }
  }
}
//HOVER
// function getUserInfo() {
//   FB.api('/me', {
//     // access_token: accessToken,
//     fields: 'id,name,email,picture'
//   }, function(res) {
//     console.log(res);
//     logInName = res.name
//     logInEmail = res.email
//     logInphoto = `https://graph.facebook.com/${res.id}/picture?type=large`
//   });
// }