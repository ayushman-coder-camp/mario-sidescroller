import { saveAs } from 'file-saver';

const themeToggle = document.querySelector('.themeToggle')
const notesArea = document.querySelector('.note-container')
const noteBtn = document.querySelector('.notes button')
const calendar = document.querySelector('.calendar-toggled')
const openRewardsButton = document.querySelector('.open-reward')

let noteBoxes = document.querySelectorAll('.note-box')

// Dark and light theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-state')

    themeToggle.querySelector('span:nth-child(1)').classList.toggle('active')
    themeToggle.querySelector('span:nth-child(2)').classList.toggle('active')
})

// Notes section
noteBtn.addEventListener('click', () => {
    let noteBox = document.createElement('p')
    let deleteIcon = document.createElement('img')

    noteBox.className = 'note-box'
    noteBox.setAttribute('contenteditable', 'true')
    deleteIcon.src = '/static/images/delete.png'
    notesArea.appendChild(noteBox).appendChild(deleteIcon)
})

notesArea.addEventListener('click', function(event) {
    if (event.target.tagName === "IMG") {
        event.target.parentElement.remove()
    }
})

// Dashboard calendar
dycalendar.draw({
    target: '.calendar',
    type: 'month',
    dayFormat: 'full',
    monthFormat: 'full',
    highlighttargetdate: true,
    prevnextbutton: 'show'
})

function toggleCalendar() {
    calendar.classList.toggle('active')
}

// Rewards
function getReward() {
    playPoints += 100
    playPointsNumber.innerText = playPoints
    console.log(playPoints);
    saveDynamicPoints()
}

function saveDynamicPoints() {
    const playPointsNumber = document.querySelector('.points-value')

    var blob = new Blob([playPointsNumber], {type: 'text/javascript;charset=utf-8'})
    saveAs(blob, '/points.js')
}