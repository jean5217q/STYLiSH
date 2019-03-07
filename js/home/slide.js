

(function(){
  var URL = document.location.toString();
  var useragent = navigator.userAgent;
  useragent = useragent.toLowerCase();
  let carouselMobile = false
  if(useragent.indexOf('iphone') != -1 ) carouselMobile = true
  else if(useragent.indexOf('android') != -1 ) carouselMobile = true
  else if(useragent.indexOf('ipad') != -1 ) carouselMobile = true

  const url = 'https://api.appworks-school.tw/api/1.0/marketing/campaigns'
  let data = []
  let width = document.body.clientWidth //抓取視窗寬度(位移用)
  const heroImgGroup = document.querySelector('.hero-image-group') //最大 
  const heroImgWrap = document.querySelector('.hero-image-wrap') //整條輪播
  const dotWrap = document.querySelector('.dot-wrap') //點全組
  
  fetch(url)
  .then(res => {
    return res.json()
  })
  .then(json => {
    data = json.data
    createSlideItem(data)
    width = document.body.clientWidth //網頁起始寬度(101vh)
    heroImgWrap.style.left=`-${width}px` //輪播起始定位
    renderDot(data)
    currentDot(1)
    clickHandler()
  })


  let interval = setInterval(autoSlide,8000)
  
  //元素創建(OK)
  function createElement(frame,id) {
    //圖片元素
    const heroImg = document.createElement('div')
    heroImg.className='hero-image'
    heroImg.style.backgroundImage = 
    `linear-gradient(90deg,white,rgba(255, 255, 255, 0) 60%), 
    url('https://api.appworks-school.tw${data[id].picture}')` 
    //處理文字
    const textArray = data[id].story.split(/[\n,]/g) //依照換行分割
    const mainTextArray = textArray.slice(0,3)
    const subTextArray = textArray.slice(3)
    //文字框
    const textWrap = document.createElement('div')
    textWrap.className ='hero-text'
    //主文字
    const mainTextWrap = document.createElement('div')
    mainTextWrap.className='main-text'
    mainTextArray.forEach(el => {
      const mainText = document.createElement('span')
      mainText.textContent = el
      mainTextWrap.appendChild(mainText)
    })
    //副文字
    const subTextWrap = document.createElement('div')
    subTextWrap.className='sub-text'
    const subText = document.createElement('span')
    subText.textContent = subTextArray
    subTextWrap.appendChild(subText)
    //文字區域串接
    textWrap.appendChild(mainTextWrap)
    textWrap.appendChild(subTextWrap)
    //主體串接
    frame.appendChild(heroImg)
    frame.appendChild(textWrap)
  }

  //動態抓取視窗寬度
  window.onresize = () => {
    width = document.body.clientWidth
    heroImgWrap.classList.remove('time') //拉伸時不要動畫
    heroImgWrap.style.left = -width+'px'
  }
  /* 
  f3 = 0*w
   1 = 1*w
   2 = 2*w
  e3 = 3*w

  1-2 傳1
  2-3 傳2
  3-1 傳3
  */
  //往右滑動
  function slideRightHandler(id) {
    //如果最後一張圖在最後(312'3')移動到最前複製項('3'123)
    if(heroImgWrap.lastChild.classList.contains('img-active')) {
      heroImgWrap.classList.remove('time')
      heroImgWrap.style.left = '0px'
    }
    let distance = parseInt(id) //位移倍率
    distance = distance+1

    function move() {
      setTimeout(function(){
        heroImgWrap.style.left=`-${width*distance}px`
        heroImgWrap.classList.add('time')
      },10)
    }
    // 點最後跳到第一
    if(distance>data.length) {
      distance = 1
      move()
    }
    // 點x移動到最後要變換順序到複製項目
    if(distance===data.length) {
      move()
      setTimeout(function(){
        heroImgWrap.classList.remove('time')
        heroImgWrap.style.left = '0px'
      },200)
    }
    else {
      move()
    }
    //當前畫面加上active判定最後一張的位置在最前和最後用
    const allImg = document.querySelectorAll('.hero-image-area')
    allImg.forEach(el=>el.classList.remove('img-active'))
    allImg.forEach(el=>{
      if(parseInt(el.dataset.index)===distance&&!el.classList.contains('end')) {
        el.classList.add('img-active')
      }
    })
  }
  /* 
  3-2 傳3
  2-1 傳2
  1-3 傳1
  */
  //往左滑動
  function slideLeftHandler(id) {
    //如果最後一張圖在最前('3'123)移動到最後(312'3')
    if(heroImgWrap.firstChild.classList.contains('img-active')) {
      heroImgWrap.classList.remove('time')
      heroImgWrap.style.left = `-${width*data.length}px`
    }
    let distance = parseInt(id)
    distance = distance-1
    // 點第一張後第三張要變換順序
    if(distance===0) {
      heroImgWrap.style.left=`-${width*distance}px`
      heroImgWrap.classList.add('time')
      setTimeout(function(){
        heroImgWrap.classList.remove('time')
        heroImgWrap.style.left = `${-width*data.length}px`
      },200)
      distance = data.length
    }
    else {
      setTimeout(function(){
        heroImgWrap.style.left=`-${width*distance}px`
        heroImgWrap.classList.add('time')
      },10)
    }
    const allImg = document.querySelectorAll('.hero-image-area')
    allImg.forEach(el=>el.classList.remove('img-active'))
    allImg.forEach(el=>{
      if(parseInt(el.dataset.index)===distance&&!el.classList.contains('first')) {
        el.classList.add('img-active')
      }
    })
  }
  

  //點哪跳哪=>判斷左到右，右到左(O) 第一到最後 /最後到第一另外判斷
  function clickHandler() {
    const dotGroup = document.querySelectorAll('.dot')
    function dotSite(el) {
      const activeItem = document.querySelector('.img-active')
      const activeId = parseInt(activeItem.dataset.index)
      const id = parseInt(el.dataset.index)
      //3-1(3)/10-1(10)
      if(activeId===data.length&&id===1) {
        slideRightHandler(data.length)
      }
      //1-3(1)/1-10(1)
      else if(activeId===1&&id===data.length) {
        slideLeftHandler(1)
      }
      //2-3(2)/3-6(5)
      else if(activeId<id&&id!==1) {
        slideRightHandler(id-1)
      }
      //3-2(3)/6-4(5)
      else if(activeId>id&&id!==data.length) {
        slideLeftHandler(id+1)
      }
        currentDot(id)
    }
    if(!carouselMobile) {
      dotGroup.forEach(el=> el.addEventListener('click',function (e){
        dotSite(e.currentTarget)
        interval = clearInterval(interval)
        console.log('click')
    }))
    } 
  }
  //自動播放往右滑動
  function autoSlide() {
    const activeItem = document.querySelector('.img-active')
    const activeId = parseInt(activeItem.dataset.index)
    slideRightHandler(activeId)
    activeId===data.length ? currentDot(1) : currentDot(activeId+1)
  }

  //創建輪播元素(OK)
  function createSlideItem(data) {
    //基本元素
    data.forEach((el,id)=>{
      const frame = document.createElement('div')
      frame.className = 'hero-image-area'
      frame.setAttribute('data-index',id+1)
      createElement(frame,id)
      heroImgWrap.appendChild(frame)
    })
    //多插入一個slide
    const frame = document.createElement('div')
    const id = data.length-1
    frame.className = 'hero-image-area first'
    frame.setAttribute('data-index',id+1)
    createElement(frame,id)
    heroImgWrap.insertBefore(frame,heroImgWrap.childNodes[0])
    heroImgWrap.childNodes[1].classList.add('img-active') //第一張圖加入active
    heroImgWrap.childNodes[data.length].classList.add('end')
    
  }
  //render所有序列點(OK)
  function renderDot(data) {
    data.forEach((el,id)=>{
      const dot = document.createElement('div')
      dot.className = 'dot'
      dot.setAttribute('data-index',id+1)
      dotWrap.appendChild(dot)
    })
  }
  //顯示active點(OK)
  function currentDot(id) {
    const dotGroup = document.querySelectorAll('.dot')
    dotGroup.forEach(el=>{
      const dotId = parseInt(el.dataset.index) 
      el.classList.remove('active')
      if(dotId === id) el.classList.add('active')
    })
  }
  //滑入清除自動播放
  if(!carouselMobile) {
    heroImgGroup.addEventListener('mouseover',()=>{
      interval = clearInterval(interval)
      console.log('mouseover')
    })
    //移出開啟自動播放 
    heroImgGroup.addEventListener('mouseout',()=>{
      const winWidth = window.innerWidth
      interval = setInterval(autoSlide,8000)
      console.log('mouseout')
    })
  }
  

  
  /* 
  拖動
  滑鼠手指
  取得點擊距離，取得放開距離=> 判斷(< || > min distance)
  */
  let startPointX
  let endPointX
  //滑鼠按下
  if(!carouselMobile) {
    heroImgGroup.addEventListener('mousedown',function(e){
      startPointX = e.clientX
      interval = clearInterval(interval)
      console.log('mousdown')
    })
    //滑鼠放開
    heroImgGroup.addEventListener('mouseup',function(e){
      endPointX = e.clientX
      slideWay()
      console.log('mouseup')
    })
  }
  
  //觸控按下
  heroImgGroup.addEventListener('touchstart', (e)=>{
    startPointX = e.changedTouches[0].clientX
    endPointX = null
    if (!e.target.classList.contains('dot')) {
      interval = clearInterval(interval)
    }
    console.log('touch')
  })
  //觸控滑動
  heroImgGroup.addEventListener('touchmove', (e)=>{
    endPointX = e.changedTouches[0].clientX
    interval = clearInterval(interval)
    console.log('touchmove')
  })
  //觸控放開
  heroImgGroup.addEventListener('touchend',(e)=>{
    if(!endPointX) return
    slideWay()
    if (!e.target.classList.contains('dot')) {
      interval = setInterval(autoSlide,8000)
    }
    console.log('touchend')
  })

  //加入最短要滑動的距離(如果使用者滑非常快)
  function slideWay(){
    let distance = startPointX - endPointX
    console.log(distance)
    const activeItem = document.querySelector('.img-active')
    let id = parseInt(activeItem.dataset.index)
    if(distance < 0 && Math.abs(distance) > 50) {
      slideLeftHandler(id)
      id===1 ? currentDot(data.length) : currentDot(id-1) 
    }
    else if(distance>0 && Math.abs(distance) > 50) {
      autoSlide() 
    }
  }
})()


