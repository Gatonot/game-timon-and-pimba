// TODO: check code for optimizate
const player = {
    name: '',
    character: ''
}

let btnToPlayIsActive = false
const MIN_LENGTH_PLAYER_NAME = 3


const nameField = document.querySelector('.name-field')
const btnToPlay = document.querySelector('.btn-to-play')

nameField.addEventListener('input', (event) => {
    btnToPlayIsActive = event.target.value.length > MIN_LENGTH_PLAYER_NAME
    
    if(btnToPlayIsActive) {
        btnToPlay.classList.remove('disabled')
    } else {
        btnToPlay.classList.add('disabled')
    }

    player.name = event.target.value
})


const characterSelected = document.querySelector('.select-character input[checked]')
player.character = characterSelected.dataset.name

const charactersBox = document.querySelector('.select-character')
charactersBox.addEventListener('click', (event) => {
    if(event.target.closest('img')) {
        const characterSelected = event.target.parentNode.querySelector('input')
        player.character = characterSelected.dataset.name
    }
})

const rulesButton = document.querySelector('.rules-btn')
const rulesText = document.querySelector('.rules-text')

rulesButton.addEventListener('click', () => rulesText.classList.toggle('active'))

btnToPlay.addEventListener('click', () => {
    if(btnToPlayIsActive) {
        localStorage.setItem('player', JSON.stringify(player))
        location.href = 'game.html'
    }
})
