class Sprite {
    constructor ({ position, velocity, image, frames = { amount: 1, speed: 10 }, spritesheets, animation = false, context }) {
        this.position = position
        this.image = image
        this.frames = {...frames, data: 0, buffer: 0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.amount
            this.height = this.image.height
        }

        this.animation = animation
        this.spritesheets = spritesheets
        this.opacity = 1
        this.health = 1000
        this.context = context
    }

    init() {
        this.context.drawImage(
            this.image,
            this.frames.data * this.width,
            0,
            this.image.width / this.frames.amount,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.amount,
            this.image.height
        )

        if (!this.animation) return

        if (this.frames.amount > 1) {
            this.frames.buffer++
        }

        if (this.frames.buffer % this.frames.speed === 0) {
            if (this.frames.data < this.frames.amount - 1) {
                this.frames.data++
            } else {
                this.frames.data = 0
            }
        }
    }

    attack({ attack, opponent }) {
        const timeline = gsap.timeline()

        timeline.to(this.position, {
            x: this.position.x - 20
        }).to(this.position, {
            x: this.position.x + 36,
            duration: 0.1,
            onComplete() {
                gsap.to('#dragoHealth', {
                    width: this.health - attack.attackDamage + '%'
                })

                gsap.to(opponent.position, {
                    x: opponent.position.x + 15,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.07,
                })
            }
        }).to(this.position, {
            x: this.position.x
        })
    }
}

export default Sprite