//const
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const friends = []
let filterFriends = []

const body = document.querySelector('#body')
const dataPanel = document.querySelector('#data-panel')
const dataList = document.querySelector('#data-list')
const modal = document.querySelector('.modal-content')
const submitButton = document.querySelector('#submit-button')
const inputValue = document.querySelector('#inlineFormInputGroupUsername')
const FRIEND_PER_PAGE = 10
const pageNavigation = document.querySelector('#Page-navigation')
const buttons = document.querySelector('#buttons')
const navbar = document.querySelector('#NavBar')


// get index data
axios.get(INDEX_URL).then((response) => {
  friends.push(...response.data.results)
  renderPaginator(friends.length)
  renderFriendList(getFriendByPages(1))
  renderList(getFriendByPages(1))
  document.getElementById("data-list").style.display = "none"
})


// 監聽器 for button "more" & "+"
body.addEventListener('click', function openModal(event) {
  const friendID = Number(event.target.dataset.id)
 
  if (event.target.matches('.btn-show-movie')) {
    showFriendModal(friendID)
    return
  } else if (event.target.matches('.btn-add-friend') && (event.target.innerText === '+')) {
    addToFollow(friendID)
    event.target.innerText = '已經加了啦~來聊天~'
  } else if (event.target.matches('.btn-add-friend') && (event.target.innerText === '已經加了啦~來聊天~')){
    event.target.innerText = '+'
    removeFromFollow(friendID)
  }
  
})

// 監聽器 for button "submit" 
submitButton.addEventListener('click' || 'keydown', function onSubmitButton(event) {
    event.preventDefault()

    const keyword = inputValue.value.trim().toLowerCase()
    if (!keyword.length) {
      return alert('Please enter valid string.')
    }


    filterFriends = friends.filter((friend) => ((friend.name.toLowerCase().includes(keyword)) || (friend.surname.toLowerCase().includes(keyword))))

    if (filterFriends.length === 0) {
      alert(`not found name includes '${keyword}'`)
    } else {
      renderFriendList(getFriendByPages(1))
      renderList(getFriendByPages(1))
      renderPaginator(filterFriends.length)
    }
})

//監聽器 for button "pages"
pageNavigation.addEventListener('click', function onPagesButton(event) {
  if (event.target.tagName !== 'A') return //如果被點擊的不是 a 標籤，結束

  const page = Number(event.target.dataset.page)
  renderFriendList(getFriendByPages(page)) 
  renderList(getFriendByPages(page))
})

//監聽器 for button "list" or "photo"
buttons.addEventListener('click', function onListOrPhotoButton (event){
  if (event.target.matches('.fa-bars')){
    document.getElementById("data-panel").style.display = "none"
    document.getElementById("data-list").style.display = ""
    } else if (event.target.matches('.fa-th')){
    document.getElementById("data-panel").style.display = ""
    document.getElementById("data-list").style.display = "none"
    }
  }
  )

// function (將API data寫進HTML裡面)
function renderFriendList(data){
  let rawHTML = ''

  data.forEach((item)=>{
    rawHTML +=`
    <div class="friend-card mt-5" style="width: 18rem;">
      <img
        src= "${item.avatar}"
        class="card-img-top" alt="...">
      <div class="friend-body">
      <h5 class="friend-title">${item.name + item.surname}</h5>
        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id = "${item.id}">More
        </button>
        <button class="btn btn-outline-primary btn-add-friend" data-id = "${item.id}">${checkIfFriendAdded(item.id) ? "已經加了啦~來聊天~" : "+"}</button>
      </div>
    </div>
    `
  })

  
  dataPanel.innerHTML = rawHTML
  document.getElementById("data-list").style.display = "none"

}



//function renderList
function renderList (data){
  let rawHTML = ''
  let index = 1
  data.forEach(item =>{
    rawHTML += `
    <tr>
      <th scope="row">${index++}</th>
      <th scope=>${item.name}</th>
      <td>${item.surname}</td>
      <td>${item.gender}</td>
      <td>${item.age}</td>
      <td>${item.region}</td>
      <td><button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id = "${item.id}">More
        </button>
        <button class="btn btn-outline-primary btn-add-friend" data-id = "${item.id}">${checkIfFriendAdded(item.id) ? "已經加了啦~來聊天~" : "+"}</button>
    </tr></td>
    `
  })

    dataList.children[1].innerHTML = rawHTML 
}

//function renderPaginator
function renderPaginator (amount){
  const numberOfPages = Math.ceil( amount / FRIEND_PER_PAGE)
  const pagination = document.querySelector('.pagination')
  
  let rawHTML= ''
  for (let page = 1; page <= numberOfPages; page++){
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page = "${page}" >${page}</a></li>`

    pagination.innerHTML = rawHTML
  }
}

// function getFriendByPages
function getFriendByPages(page) {
  const data = filterFriends.length ? filterFriends : friends
  const startIndex = (page - 1) * FRIEND_PER_PAGE
  const endIndex = (startIndex + FRIEND_PER_PAGE)
  return data.slice(startIndex, endIndex)
}

//function to replace modal HTML
function showFriendModal(id){
  const friendTitle = document.querySelector('#friend-modal-title')
  const friendImage = document.querySelector('#friend-modal-image')
  const friendDate = document.querySelector('#friend-modal-date')
  const friendDescription = document.querySelector('#friend-modal-description')

  // 先把資料清空
  friendTitle.innerText = ''
  friendDate.innerText = ''
  friendDescription.innerText = ''
  friendImage.innerHTML = `<img src="" alt="friend-poster" class="image-fluid">`

  axios.get(INDEX_URL+id).then((response) =>{
    console.log(response)
    const data = response.data
    friendTitle.innerText = data.name + data.surname
    friendDate.innerText = `Birthday: ${data.birthday}`
    friendDescription.innerText = `Gender: ${data.gender}; Age: ${data.age}; Region: ${data.region}`
    friendImage.innerHTML = `<img src="${data.avatar}" alt="friend-poster" class="image-fluid">`
  })
}

// function for addToFollow
function addToFollow(id){
  const list = JSON.parse(localStorage.getItem('Followed')) || []
  const IFollowed = friends.find(friend=> friend.id === id)

  if (list.some(friend => friend.id === id)){
    return alert('You have followed the beauty or handsome.')
  } else {
    list.push(IFollowed)
    localStorage.setItem('Followed', JSON.stringify(list))
    
  }
}

//function to removeFromFollow
function removeFromFollow(id) {
  const followedFriends = JSON.parse(localStorage.getItem('Followed'))
  if (!followedFriends || !followedFriends.length) return

  const IFollowedIndex = followedFriends.findIndex(friend => friend.id === id)

  if (followedFriends.some(friend => friend.id === id) || !(friends.length === 0)) {
    followedFriends.splice(IFollowedIndex, 1)
    localStorage.setItem('Followed', JSON.stringify(followedFriends))
  }
}

//加好友後修改加號變成'已經加了啦~來聊天~'
function checkIfFriendAdded(id) {
  const list = JSON.parse(localStorage.getItem('Followed')) || []
  return list.some(item => item.id === id)
  }




