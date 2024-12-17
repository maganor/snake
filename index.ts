const canvas = document.getElementById("canvas") as HTMLCanvasElement
let ctx = canvas.getContext("2d")!;

const score = document.getElementById("score")!

interface Vec2 {
    x: number,
    y: number
}

const initalState = {
    pos: {x: 3, y: 5},
    body: [{x: 2, y: 5}, {x: 1, y: 5}] 
}

const square_size = 20
const height = canvas.height / square_size
const width = canvas.width / square_size
let headPos: Vec2 = {...initalState.pos}
let body: Vec2[] = structuredClone(initalState.body)
let isWaiting = true
let direction = {x: 1, y: 0};
let keys = ["w", "a", "s", "d"]

window.addEventListener("keypress", (event) => {
    let { key } = event
    if(keys.includes(key)){
        if(isWaiting) {
            isWaiting = false
        }
        if (key == "w") {
            if(direction.y != 1) {
                direction = {x: 0, y: -1}
            }
        } else if (key == "s") {
            if(direction.y != -1) {
                direction = {x: 0, y: 1}
            }
        } else if (key == "a") {
            if(direction.x != 1) {
                direction = {x: -1, y: 0}
            }
        } else if (key == "d") {
            if(direction.x != -1) {
                direction = {x: 1, y: 0}
            }
        }
    }
})

function moveSnake() {
    let prevPart: Vec2
    let prevPos = {...headPos}
    headPos = {
        x: headPos.x + direction.x, 
        y: headPos.y + direction.y}
    for(let part of body) {
        prevPart = {...part}
        part.x = prevPos.x
        part.y = prevPos.y
        prevPos = {...prevPart}
    }
    if(body.find(part => part.x == headPos.x && part.y == headPos.y)){
        frutasComidas = 0
        isWaiting = true
        headPos = {...initalState.pos}
        body = structuredClone(initalState.body)
    }
    if(headPos.x >= width || headPos.x < 0 || headPos.y >= height || headPos.y < 0){
        frutasComidas = 0
        isWaiting = true
        headPos = {...initalState.pos}
        body = structuredClone(initalState.body)
    }
    if(headPos.x == fruitPos.x && headPos.y == fruitPos.y) {
        frutasComidas++;
        fruitPos = generateFruit()
        body.push({x: body[body.length-1].x, y: body[body.length-1].y})
    }
}

function generateFruit(): Vec2 {
    let x = Math.floor(Math.random() * width)
    let y = Math.floor(Math.random() * height)
    while((x == headPos.x || body.find(part => part.x == x)) && (y == headPos.y || body.find(part => part.y == y))){
        x = Math.floor(Math.random() * width)
        y = Math.floor(Math.random() * height)
    }
    return {x, y}
}
let frutasComidas = 0

let fruitPos = generateFruit()
let start: DOMHighResTimeStamp;
function draw(timestamp: DOMHighResTimeStamp) {
    if(!isWaiting) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;
        if(elapsed > 100) {
            moveSnake()
            start = timestamp;
        }
    }
    //Reset canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    //Draw playfield
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    //Draw head
    ctx.fillStyle = "#AB0707"
    ctx.fillRect(square_size*headPos.x, square_size*headPos.y, square_size, square_size)
    //Draw body
    for(let part of body) {
        ctx.fillStyle = "#F74040"
        ctx.fillRect(square_size*part.x, square_size*part.y, square_size, square_size)
        
    }
    //Draw fruit
    ctx.fillStyle = "green"
    ctx.fillRect(square_size*fruitPos.x, square_size*fruitPos.y, square_size, square_size)

    if(isWaiting) {
        ctx.fillStyle = "red"
        ctx.font = "27px Arial"
        ctx.fillText("Esperando movimiento", 20, 150)
    }
    score.textContent = `SCORE: ${frutasComidas}`
    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)
