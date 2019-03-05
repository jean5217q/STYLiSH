const userName = document.querySelector('.profile-user-name')
const userEmail = document.querySelector('.profile-user-email')
const userIcon = document.querySelector('.profile-photo-inner')
const userInfo = JSON.parse(localStorage.getItem('user'))

userName.textContent = userInfo.name
userEmail.textContent = userInfo.email
userIcon.style.backgroundImage = `url(${userInfo.photo})`

