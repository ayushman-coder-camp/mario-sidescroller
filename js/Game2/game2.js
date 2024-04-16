const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreLabel = document.querySelector('.scoreLabel')
const gameOverModal = document.querySelector('.gameOverModal')
const gameOverScore = document.querySelector('.gameOverModal .score')
const restartButtonEl = document.querySelector('#restartBtnEl')
const startGameModal = document.querySelector('.startGameModal')
const startButtonEl = document.querySelector('#startBtnEl')
const audioButtonEl = document.querySelector('.audioButton')

const audio = {
    Game: new Howl({
        src: '/static/audio/BaseGameMusic.wav',
        html5: true
    })
}

canvas.width = 1494
canvas.height = 805

class BaseProtecter {
    constructor(posX, posY, radius, color) {
        this.x = posX
        this.y = posY
        this.radius = radius
        this.color = color
    }

    create() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, vel) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = vel
    }

    create() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    animate() {
        this.create()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Giant {
    constructor(x, y, radius, color, vel) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = vel
    }

    create() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    animate() {
        this.create()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


let player = new BaseProtecter(canvas.width / 2, canvas.height / 2, 38, 'white')

let projectiles = []
let giants = []

function init() {
    player = new BaseProtecter(canvas.width / 2, canvas.height / 2, 38, 'white')
    projectiles = []
    giants = []
    animationLoopId
    score = 0
}

function createGiants() {
    setInterval(() => {
        const radius = Math.random() * (65 - 38) + 38

        let x
        let y
        
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const enemyAngle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )

        const velocity = {
            x: Math.cos(enemyAngle),
            y: Math.sin(enemyAngle)
        }

        giants.push(
            new Giant(
                x,
                y,
                radius,
                color,
                velocity
            )
        )
    }, 1000)
}

let animationLoopId
let score = 0
function animate_game() {
    animationLoopId = requestAnimationFrame(animate_game)

    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.create()
    projectiles.forEach((projectile, index) => {
        projectile.animate()

        if (
                projectile.x - projectile.radius < 0 ||
                projectile.x - projectile.radius > canvas.width || 
                projectile.y + projectile.radius < 0 ||
                projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })

    giants.forEach((giant, i) => {
        giant.animate()

        const distance = Math.hypot(player.x - giant.x, player.y - giant.y)

        if (distance - giant.radius - player.radius < 1) {
            cancelAnimationFrame(animationLoopId)
            gameOverModal.style.display = 'flex'
            gameOverScore.innerHTML = score
        }

        projectiles.forEach((projectile, p) => {
            const distance = Math.hypot(projectile.x - giant.x, projectile.y - giant.y)

            if (distance - giant.radius - projectile.radius < 1) {
                if (giant.radius > 28) {
                    score += 50
                    scoreLabel.innerHTML = score
                    giant.radius -= 15
                    
                    setTimeout(() => {
                        projectiles.splice(p, 1)
                    }, 0);
                } else {
                    score += 100
                    scoreLabel.innerHTML = score
                    setTimeout(() => {
                        giants.splice(i, 1)
                        projectiles.splice(p, 1)
                    }, 0);
                }
            }
        })
    })
}


addEventListener('click', (event) => {
    const ATAN2_ANGLE = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )

    projectiles.push(
        new Projectile(
            canvas.width / 2,
            canvas.height / 2,
            7,
            'white',
            {
                x: Math.cos(ATAN2_ANGLE) * 7,
                y: Math.sin(ATAN2_ANGLE) * 7
            }
        )
    )
})

restartButtonEl.addEventListener('click', () => {
    init()
    animate_game()
    createGiants()
    gameOverModal.style.display = 'none'
})

startButtonEl.addEventListener('click', () => {
    init()
    animate_game()
    createGiants()
    startGameModal.style.display = 'none'
})

let gesture = false
audioButtonEl.addEventListener('click', () => {
    if (!gesture) {
        audio.Game.play()
    }
})