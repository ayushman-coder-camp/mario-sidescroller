import Sprite from '/static/js/Game1/classes/Sprite.js'
import CollisionBlock from '/static/js/Game1/classes/CollisionBlock.js'
import collisionBlocks from '/static/js/Game1/data/collisionBlocks.js'
import battleZones from '/static/js/Game1/data/battleZones.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const background = new Image()
background.src = '/static/images/Game1/Zord World.png'

const playerDown = new Image()
playerDown.src = '/static/images/Game1/playerDown.png'

const playerUp = new Image()
playerUp.src = '/static/images/Game1/playerUp.png'

const playerLeft = new Image()
playerLeft.src = '/static/images/Game1/playerLeft.png'

const playerRight = new Image()
playerRight.src = '/static/images/Game1/playerRight.png'

canvas.width = innerWidth
canvas.height = innerHeight

const collisionBlocksMap = []
for (let i = 0; i < collisionBlocks.length; i += 70) {
    collisionBlocksMap.push(collisionBlocks.slice(i, 70 + i));
}

const battleZonesMap = []
for (let i = 0; i < battleZones.length; i += 70) {
    battleZonesMap.push(battleZones.slice(i, 70 + i));
}

const boundaries = []
const canvasOffset = {
    x: -50,
    y: -300
}

collisionBlocksMap.forEach((row, x) => {
    row.forEach((symbol, y) => {
        if (symbol === 1025) {
            boundaries.push(
                new CollisionBlock({
                    position: {
                        x: y * CollisionBlock.width + canvasOffset.x,
                        y: x * CollisionBlock.height + canvasOffset.y
                    },
                    
                    context: ctx
                })
            )
        }
    })
})

const battleZonesData = []

battleZonesMap.forEach((row, x) => {
    row.forEach((symbol, y) => {
        if (symbol === 1025) {
            battleZonesData.push(
                new CollisionBlock({
                    position: {
                        x: y * CollisionBlock.width + canvasOffset.x,
                        y: x * CollisionBlock.height + canvasOffset.y
                    },
                    
                    context: ctx
                })
            )
        }
    })
})

const keys = {
    arrowDown: {
        pressed: false
    },

    arrowUp: {
        pressed: false
    },

    arrowLeft: {
        pressed: false
    },

    arrowRight: {
        pressed: false
    }
}

const backgroundSprite = new Sprite({
    position: {
        x: canvasOffset.x,
        y: canvasOffset.y
    },

    image: background,
    context: ctx
})

const player = new Sprite({
    position: {
        x: 648,
        y: 420
    },

    image: playerDown,
    frames: {
        amount: 4,
        speed: 10
    },

    spritesheets: {
        down: playerDown,
        up: playerUp,
        left: playerLeft,
        right: playerRight
    },
    
    context: ctx
})

const fixedObjects = [backgroundSprite, ...boundaries, ...battleZonesData]
const battle = {
    initiatedState: false
}

function collisionDetection({ rect1, rect2 }) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )
}

function animateOverworld() {
    const animationInterger = window.requestAnimationFrame(animateOverworld)
    
    backgroundSprite.init()
    boundaries.forEach((boundary) => {
        boundary.init()
    })

    battleZonesData.forEach((battleZone) => {
        battleZone.init()
    })

    player.init()

    let moving = true
    player.animation = false

    if (battle.initiatedState) return

    if (keys.arrowDown.pressed || keys.arrowUp.pressed || keys.arrowLeft.pressed || keys.arrowRight.pressed) {
        for (let i = 0; i < battleZonesData.length; i++) {
            const battleZone = battleZonesData[i]
            const overLappingZone = 
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) - 
                Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                Math.max(player.position.y, battleZone.position.y))
            if (
                collisionDetection({
                    rect1: player,
                    rect2: battleZone
                }) &&
                overLappingZone > (player.width, player.height) / 2
                && Math.random() < 0.001
            ) {
                // cancel current animation loop
                window.cancelAnimationFrame(animationInterger)

                battle.initiatedState = true
                gsap.to('.overLappingFlash', {
                    opacity: 1,
                    repeat: 4,
                    yoyo: true,
                    duration: 0.5,
                    onComplete() {
                        gsap.to('.overLappingFlash', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // activate new animation loop function for battle scene
                                animateBattleScene()
                                gsap.to('.overLappingFlash', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }

    if (keys.arrowDown.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            player.animation = true
            player.image = player.spritesheets.down
            const boundary = boundaries[i]
            if (
                collisionDetection({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            ) {
                moving = false
                break
            }
        }

        if (moving)
        fixedObjects.forEach((fixedObject) => {
            fixedObject.position.y -= 3
        })
    } else if (keys.arrowUp.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            player.animation = true
            player.image = player.spritesheets.up
            const boundary = boundaries[i]
            if (
                collisionDetection({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ) {
                moving = false
                break
            }
        }

        if (moving)
        fixedObjects.forEach((fixedObject) => {
            fixedObject.position.y += 3
        })
    } else if (keys.arrowLeft.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            player.animation = true
            player.image = player.spritesheets.left
            const boundary = boundaries[i]
            if (
                collisionDetection({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }

        if (moving)
        fixedObjects.forEach((fixedObject) => {
            fixedObject.position.x += 3
        })
    } else if (keys.arrowRight.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            player.animation = true
            player.image = player.spritesheets.right
            const boundary = boundaries[i]
            if (
                collisionDetection({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }

        if (moving)
        fixedObjects.forEach((fixedObject) => {
            fixedObject.position.x -= 3
        })
    }
}

animateOverworld()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = '/static/images/Game1/battle_background.png'

const starmanImage = new Image()
starmanImage.src = '/static/images/Game1/starman.png'

const dragoImage = new Image()
dragoImage.src = '/static/images/Game1/drago.png'

const battleSceneBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },

    image: battleBackgroundImage,
    context: ctx,
})

const starman = new Sprite({
    position: {
        x: 300,
        y: 350
    },

    image: starmanImage,
    frames: {
        amount: 5,
        speed: 10
    },

    animation: true,
    context: ctx,
})

const drago = new Sprite({
    position: {
        x: 1100,
        y: 400
    },

    image: dragoImage,
    frames: {
        amount: 4,
        speed: 30
    },

    animation: true,
    context: ctx,
})

function animateBattleScene() {
    window.requestAnimationFrame(animateBattleScene)

    battleSceneBackground.init()
    starman.init()
    drago.init()
}

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
        starman.attack({
            attack: {
                attackName: 'Tackle',
                attackDamage: 100,
                attackType: 'Normal'
            },

            opponent: drago
        })
    })
})

addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            keys.arrowDown.pressed = true
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = true
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true
            break
    }
})

addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowDown':
            keys.arrowDown.pressed = false
            break
        case 'ArrowUp':
            keys.arrowUp.pressed = false
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false
            break
    }
})