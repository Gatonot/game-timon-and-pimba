let healthPoint = 100
let playerIsDead = false

const healthBox = document.querySelector('.health-box span')
healthBox.textContent = healthPoint
const timerBox = document.querySelector('.timer-box span')

const timer = {
    second: 0,
    minute: 0
}

setInterval(() => {
    healthPoint--
    healthBox.textContent = healthPoint

    if(!healthPoint) {
        // location.href = '/index.html'
    }
    
    timerBox.textContent = setTimer()
    
}, 1000)

const setTimer = () => {
    if(timer.second === 60) {
        timer.second = 0
        timer.minute++
    }
    
    if(timer.second <= 9) {
        timer.second = `0${timer.second}`
    }

    const timerResult = timer.minute <= 9 ? `0${timer.minute}:${timer.second}` : `${timer.minute}:${timer.second}`
    timer.second++

    return timerResult
}

// TODO:
// - Сделать сбор еды
// - Сделать взаимодействие с физически-твёрдыми объектами
const canvas = {
    canvas: null,
    context: null,
    sprite: null,
    frame: 0,
    spriteSettings: {
        posXImage: 0,
        posYImage: 0,
        widthImage: 100,
        heightImage: 100,
        posXCanvas: 10,
        posYCanvas: 600,
        widthOnCanvas: 100,
        heightOnCanvas: 100,
    },
    playerControll() {
        document.addEventListener('keydown', (event) => {
            // TODO: Сделать двойные нажатия (вверх-влево, вверх-вправо)

            // Движение Right
            if(event.code === 'ArrowRight') {
                const middleContext = this.canvas.width / 2

                this.spriteSettings.posYImage = 100
                this.spriteSettings.posXImage = 100

                if(this.spriteSettings.posXCanvas <= middleContext) {
                    this.spriteSettings.posXCanvas += 10

                     // Если есть прыжок
                    if(event.ctrlKey) {
                        let timerUpRight = setInterval(() => {
                            if(this.spriteSettings.posYCanvas > 580) {
                                clearInterval(timerUpRight)
                            }
                            this.spriteSettings.posXCanvas += 5
                        })
                    }
                }
            }
            // Движение Left
            // TODO: Добавить отзеркаливание персонажа (новый спрайт)
            if(event.code === 'ArrowLeft') {
                // Ограничение по правому краю
                const CANVAS_POS_X_START = 10
                if (this.spriteSettings.posXCanvas > CANVAS_POS_X_START) {
                    this.spriteSettings.posYImage = 100
                    this.spriteSettings.posXImage = 100
                    this.spriteSettings.posXCanvas -= 10
                } else {
                    this.spriteSettings.posXCanvas += .1
                }

                // Если есть прыжок
                if(event.ctrlKey) {
                    let timerUpLeft = setInterval(() => {
                        if(this.spriteSettings.posYCanvas > 580) {
                            clearInterval(timerUpLeft)
                        }
                        this.spriteSettings.posXCanvas -= 5
                    })
                }
            }
            // BUGFIX: пока персонаж в воздухе, нельзя нажать ещё раз вверх
            if(this.spriteSettings.posYCanvas > 580) {
                if(event.ctrlKey) {
                    this.spriteSettings.posYImage = 200
                    this.spriteSettings.posXImage = 100
    
                    // TODO: Избавить от магических чисел
                    let timer = setInterval(() => {
    
                        if(this.spriteSettings.posYCanvas < 450) {
                            clearInterval(timer)
                            this.grav()
                        }
                        this.spriteSettings.posYCanvas -= 10
                    })
                }
            }
        })
        // Остановка анимации, когда клавиша отжата
        document.addEventListener('keyup', (event) => {
            if(event.code === 'ArrowRight' || event.code === 'ArrowLeft' || !event.ctrlKey) {
                this.spriteSettings.posXImage = 0
                this.spriteSettings.posYImage = 0
            }
        })
        this.run()
    },
    grav() {
        // TODO: Избавить от магических чисел
        let timer = setInterval(() => {
            if(this.spriteSettings.posYCanvas > 580) {
                clearInterval(timer)
                // BUGFIX: персонаж застряёт в текстурах, перерендериваем позицию
                this.spriteSettings.posYCanvas = 590
            }
            this.spriteSettings.posYCanvas += 5
        })
    },
    init() {
        this.context = document.getElementById('canvas').getContext('2d')
        this.canvas = document.getElementById('canvas')

        this.canvas.width = 1400
        this.canvas.height = 800
    },
    animate() {
        setInterval(() => {
            this.frame++
            if(this.frame > 5) { this.frame = 0 }
        }, 60)
    },
    render() {
        this.renderStack.clearArea.call(this)
        this.renderStack.character.call(this)
        this.renderStack.floorDirt.call(this)
        
    },
    renderStack: {
        clearArea() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        },
        character() {
            this.sprite = new Image()
            this.sprite.src = 'images/timon-animation.png'
            this.context.drawImage(
                this.sprite, 
                this.spriteSettings.posXImage * this.frame, 
                this.spriteSettings.posYImage, 
                this.spriteSettings.widthImage, 
                this.spriteSettings.heightImage, 
                this.spriteSettings.posXCanvas, 
                this.spriteSettings.posYCanvas, 
                this.spriteSettings.widthOnCanvas, 
                this.spriteSettings.heightOnCanvas
            )
        },
        floorDirt() {
            const floorDirt = new Image()
            floorDirt.src = 'images/floorDirt.png'
            this.context.fillStyle = this.context.createPattern(floorDirt, 'repeat')
            this.context.fillRect(0, this.canvas.height - 100, 1400, 100)
        }
    },
    run() {
        window.requestAnimationFrame(() => {
            this.render()
            this.run()
        })
    },
    start() {
        this.init()
        this.animate()
        this.playerControll()
    }
}

window.addEventListener('load', canvas.start())
