let paths = []
const allPaths = []
const pageGap = 50;
const cellGap = 0;
let area = 30;
let canDraw = false
let zoomAmount = 100

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const colorPicker = document.querySelector('#colorWheel')
const colorInput = document.querySelector('.color-input')
const colorSquares = document.querySelectorAll('.color-square')

let pixelColor = '#000';

const menuItems = document.querySelector(".menu-items")
const listItems = Array.from(menuItems.querySelectorAll("li"))
const colorBlock = menuItems.querySelector(".color-choice")
const sizeBlock = menuItems.querySelector(".size-choice")
const zoomBlock = menuItems.querySelector(".zoom-choice")
const screenshotBlock = menuItems.querySelector(".screenshot-choice")
const userInputCellSize = document.querySelector("#squareSizeInput")
const updateSizeBtn = document.querySelector(".update-size")

const zoomInBtn = document.querySelector('.zoom-in-btn')
const zoomOutBtn = document.querySelector('.zoom-out-btn')
const zoomResetBtn = document.querySelector('.zoom-reset-btn')
const zoomAmountText = document.querySelector('.zoom-amount')
const zoomStepSize = document.querySelector('.zoom-step-size')

function drawPathIfIntersect(event) {
    for (let i = 0; i < paths.length; i++) {
        if (ctx.isPointInPath(paths[i], event.offsetX, event.offsetY)) {
            ctx.fillStyle = pixelColor
            ctx.fill(paths[i])
        }
    }
}

function checkForClass(classlist, item) {
    if (!classlist) return false;
    return Array.from(classlist).includes(item);
}

function checkAndToggle(element, classlist, className) {
    if (checkForClass(classlist, className)) {
        element.classList.toggle('list-border')
        element.classList.toggle('visually-hidden')
    }
}

function initMenu() {
    Array.from(listItems).forEach(item => {
        item.addEventListener('click', (e) => {
            const spans = Array.from(e.target.querySelectorAll('span'))
            const playIcon = e.target.querySelector('.play-icon')

            if (e.target.tagName === "LI") e.target.classList.toggle('active')

            if (playIcon) playIcon.classList.toggle('move')

            spans.forEach(span => {
                checkAndToggle(colorBlock, span.classList, 'color-icon')
                checkAndToggle(sizeBlock, span.classList, 'size-icon')
                checkAndToggle(zoomBlock, span.classList, 'zoom-icon')
                checkAndToggle(screenshotBlock, span.classList, 'screenshot-icon')
            })
        })
    })
    initColorSquares()
}

function drawGridRow(paths, y) {
    for (let i = pageGap; i < window.innerWidth - pageGap - 180; i += area) {
        const p = new Path2D()
        p.rect(i, y, area, area)
        ctx.fillStyle = '#eee'
        ctx.fill(p)
        paths.push(p)
    }
    return
}

function drawGrid(area) {
    for (let i = pageGap, j = 0; i < window.innerHeight - pageGap; i += area + cellGap, j++) {
        drawGridRow(paths, i)
    }
    return
}

// Listen for DOM events
colorInput.addEventListener('input', (evt) => {
    pixelColor = evt.target.value;
    ctx.fillStyle = evt.target.value;
})

colorPicker.addEventListener('input', (evt) => {
    pixelColor = evt.target.value
    colorInput.value = evt.target.value
})

canvas.addEventListener('click', (event) => {
    drawPathIfIntersect(event)
})

function initColorSquares() {
    const rgbRegex = /\d+/gm
    Array.from(colorSquares).forEach(square => {
        square.addEventListener('click', (event) => {
            const bg = window.getComputedStyle(event.target).backgroundColor
            const rgb = bg.match(rgbRegex)

            pixelColor = bg
            ctx.fillStyle = bg
            colorInput.value = bg
        })
    })
}

updateSizeBtn.addEventListener('click', (event) => {
    let context = (ctx);
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    area = +userInputCellSize.value
    paths = []
    drawGrid(area)
})

// TODO: implement redraw on resize (see debounce references)
window.addEventListener('resize', (e) => {
    let context = (ctx);
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    // TODO: redraw - but with the selected squares redrawn =)
    drawGrid(area)
    // ctx.fillStyle = 'blue'
    // for (let i = 0; i < paths.length; i++) {
    //     ctx.fill(paths[i])
    // }
})

canvas.addEventListener('mousedown', (event) => {
    canDraw = true
})

canvas.addEventListener('mouseup', (event) => {
    canDraw = false
})

canvas.addEventListener('mousemove', (event) => {
    if (canDraw) {
        drawPathIfIntersect(event)
    }
})

zoomInBtn.addEventListener('click', (event) => {
    zoomAmount += (parseInt(zoomStepSize.value) || 10)
    zoomAmountText.textContent = `Zoom amount: ${zoomAmount}%`
    canvas.style.transform = `scale(${zoomAmount}%)`
})

zoomOutBtn.addEventListener('click', (event) => {
    zoomAmount -= (zoomStepSize.value || 10)
    zoomAmountText.textContent = `Zoom amount: ${zoomAmount}%`
    canvas.style.transform = `scale(${zoomAmount}%)`
})

zoomResetBtn.addEventListener('click', (event) => {
    zoomAmount = 100
    zoomAmountText.textContent = `Zoom amount: ${zoomAmount}%`
    canvas.style.transform = `scale(${zoomAmount}%)`
})

initMenu()
drawGrid(area)

localStorage.setItem('paths', allPaths)
