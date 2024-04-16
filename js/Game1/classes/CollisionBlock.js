class CollisionBlock {
    static width = 48
    static height = 48
    constructor ({ position, context }) {
        this.position = position
        this.context = context
        this.width = 48
        this.height = 48
    }

    init() {
        this.context.fillStyle = 'rgba(255, 0, 0, 0.5)'
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

export default CollisionBlock