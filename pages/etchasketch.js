const easCanvas = document.querySelector('#easCanvas');
const easResetButton = document.querySelector('#easResetButton');
const DEFAULT_CANVAS_SIZE = 16;

let mouseLeftPressed = false;
let canvasSizeCurrent = DEFAULT_CANVAS_SIZE;

document.body.addEventListener('mousedown', () => {mouseLeftPressed = true;});
document.body.addEventListener('mouseup', () => {mouseLeftPressed = false;}); 

function activateGrid (event) {
    if (mouseLeftPressed || event.type == 'mousedown') {
        let o = event.currentTarget.style.opacity;
        o = parseFloat(o);
        event.currentTarget.style.opacity = 0.2 + o;
    }
}

function initializeGrid (a) {
    a.addEventListener('mouseover', activateGrid);
    a.addEventListener('mousedown', activateGrid);
}

function clearCanvas () {
    while (easCanvas.firstChild) {
        easCanvas.lastChild.remove();
    }
}

function initializeCanvas(l) {
    if (l < 16 || l > 96) {
        console.log(`Grid size ${l} out of bound`);
        return;
    }

    for (let i = 0; i < l*l; i++){
        let gridItem = document.createElement('div');
        gridItem.style.backgroundColor = 'black';
        gridItem.style.opacity = '0';
        initializeGrid(gridItem);
        easCanvas.appendChild(gridItem);    
    }

    let gridWidth = Math.floor(960/l);
    let columnSetting = `${gridWidth}px`;

    for (let i = 0; i < l-1; i++){
        columnSetting += ` ${gridWidth}px`;
    }
    easCanvas.style.display = 'grid';
    easCanvas.style.gridTemplateColumns = columnSetting;
}

easResetButton.addEventListener('click', ()=>{
    clearCanvas();
    initializeCanvas(canvasSizeCurrent);
})

easSizeButton.addEventListener('click', ()=>{
    let s = prompt('Enter an integer between 16 and 96');
    let l = parseInt(s, 10);
    if (isNaN(l)) {
        alert(`could not recognize ${s}`);
    } else if (l < 16) {
        alert(`${l} is less than 16`);
    } else if (l > 96) {
        alert(`${l} is greater than 96`);
    } else {
        clearCanvas();
        canvasSizeCurrent = l;
        initializeCanvas(l);
    }
})


initializeCanvas(DEFAULT_CANVAS_SIZE);

