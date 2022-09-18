//const
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const friends = JSON.parse(localStorage.getItem('Followed'))

const dataPanel = document.querySelector('#data-panel')
const modal = document.querySelector('.modal-content')

// start
renderFriendList(friends)

// 監聽器 for button "more" & "X"
dataPanel.addEventListener('click', function openModal(event) {
  if (event.target.matches('.btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-friend')) {
    removeFromFollow(Number(event.target.dataset.id))
  }
})

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
        <button class="btn btn-primary btn-show-friend" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id = "${item.id}">More
        </button>
        <button class="btn btn-danger btn-remove-friend" data-id = "${item.id}">X
        </button>
      </div>
    </div>`
  })
  
  dataPanel.innerHTML = rawHTML
}

//function to replace modal HTML
function showFriendModal(id){
  const friendTitle = document.querySelector('#friend-modal-title')
  const friendImage = document.querySelector('#friend-modal-image')
  const friendDate = document.querySelector('#friend-modal-date')
  const friendDescription = document.querySelector('#friend-modal-description')

  axios.get(INDEX_URL+id).then((response) =>{
    const data = response.data
    friendTitle.innerText = data.name + data.surname
    friendDate.innerText = `Birthday: ${data.birthday}`
    friendDescription.innerText = `Gender: ${data.gender}; Age: ${data.age}; Region: ${data.region}`
    //為甚麼沒辦法斷行QQ
    //<p id="friend-modal-description">Gender: ${data.gender}; <br> Age: ${data.age};</br><br> Region: ${data.region}</br></p>
    
    friendImage.innerHTML = `<img src="${data.avatar}" alt="friend-poster" class="image-fluid">`
  })
}

//function to removeFromFollow
function removeFromFollow (id){
  if (!friends || !friends.length) return

  const IFollowedIndex = friends.findIndex(friend => friend.id === id)

  if (friends.some(friend => friend.id === id) || !(friends.length === 0)) {
    friends.splice(IFollowedIndex, 1)
    localStorage.setItem('Followed', JSON.stringify(friends))
    renderFriendList(friends)
  }
}

