const calcSecondaryDisplay = document.querySelector('#calcSecondaryDisplay');
const calcMainDisplay = document.querySelector('#calcMainDisplay');
const calcButtonNamePrefix = '#calcButton';
const calcButtonNameNumerics = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Dot'];
const calcButtonNameOperators = ['Time', 'Plus', 'Divide'];
const calcSignTable = {
    'Dot' : '.',
    'Time': '*',
    'Plus': '+',
    'Divide': '/',
}
const calcSymbol = {
    '/' : '\u00f7',
    '*' : '\u00d7',
    '+' : '+',
    '-' : '-',
    '=' : '=',
}
const NUMSIGDIG = 15;
const INPUTSIZE = 17;


let calcPreDecimal = '';
let calcPostDecimal = '';
let calcHasDecimal = false;
let calcSign = 1;

let calcInputMode = true;
let calcOp = '';
let calcInactiveVal = null;
let calcInactiveValFormatted = '';
let calcIsOverFlow = false;
let calcIsNaN = false;


function initialize(){
    calcPreDecimal = '';
    calcPostDecimal = '';
    calcHasDecimal = false;
    calcSign = 1;
    calcOp = '';
    calcInactiveVal = null;
    calcInactiveValFormatted = '';
    calcIsOverFlow = false;
    calcIsNaN = false;
    calcInputMode = true;
    updateDisplay();
}

function initializeActiveNumber(){
    calcPreDecimal = '';
    calcPostDecimal = '';
    calcHasDecimal = false;
    calcSign = 1;
}

function isActiveNumberNull() {
    return (calcPreDecimal === '' && calcPostDecimal == '');
}

function checkOverFlow(res) {
    let tempVal = res;
    if (tempVal != null) {
        if (tempVal < 0) {
            tempVal *= -1;
        }
        tempVal = Math.floor(tempVal);
        let bound = '';
        for (let i = 0; i < NUMSIGDIG; i++){
            bound += '9';
        }
        if (tempVal > parseInt(bound)) {
            return true;
        }
    }
    return false;
}

function formatNumber(res) {
    if (res == null) {
        return '';
    }
    res = res.toPrecision(NUMSIGDIG);
    let exp = '';
    if (res.indexOf('e') != -1){
        res, exp = res.split('e');
        exp = 'e' + exp;
    }
    let sign = '';
    if (res < 0) {
        sign = '-';
        res = res*(-1);
    }
    // remove trailing
    let dot = (res.indexOf('.') != -1);
    while ((dot) && (res.length > 1) && ((res.charAt(res.length-1) == '0')||(res.charAt(res.length-1) == '.'))){
        if (res.charAt(res.length-1) == 'dot'){
            dot = false;
        }
        res = res.substring(0, res.length-1);
    }
    return sign + res + exp;
}



function updateMainDisplay() {
    if (calcIsNaN) {
        calcMainDisplay.textContent = "Not a Number";
        return;
    } else if (calcIsOverFlow) {
        calcMainDisplay.textContent = "Number Overflowed";
        return;
    }
    if (calcInputMode) {
        calcMainDisplay.textContent = (calcSign == -1? '-':'') + calcPreDecimal 
        + (calcHasDecimal ? '.':'') + calcPostDecimal;
    } else {
        calcMainDisplay.textContent = calcInactiveValFormatted;
    }

}

function updateSecondaryDisplay() {
    let message = '';
    if (calcIsOverFlow || calcIsNaN)  {
        message = 'Please Press CLEAR button to continue.' ;
    } else {
        message = calcInactiveValFormatted + ' ' + (calcOp == ''? '':calcSymbol[calcOp]);
    }
    calcSecondaryDisplay.textContent = message;
}

function updateDisplay() {
    updateMainDisplay();
    updateSecondaryDisplay();
}


function addToActiveNumber(c) {
    if (calcPreDecimal.length + calcPostDecimal.length == INPUTSIZE) {
        return;
    }

    if (c === '.') {
        if (calcHasDecimal === true) {
            return;
        }
        calcHasDecimal = true;
        if (calcPreDecimal === ''){
            calcPreDecimal = '0';
        }
        return;
    }

    if (c === '0' && calcHasDecimal === false) {
        if (parseInt(calcPreDecimal) === 0){
            return;
        }
        calcPreDecimal += c;
        return;
    }

    if (calcHasDecimal) {
        calcPostDecimal += c;
    } else {
        if (c != '0' && calcPreDecimal === '0') {
            calcPreDecimal = c;
        } else {
            calcPreDecimal += c;
        }        
    }
}

function updateInactiveVal() {
    let activeVal = parseFloat((calcSign == -1? '-':'') + calcPreDecimal + (calcHasDecimal ? '.':'') + calcPostDecimal);
    let res;
    if (calcInactiveVal == null) {
        res = activeVal;
    } else {
        switch (calcOp) {
            case '+':
                res =  calcInactiveVal + activeVal;
                break;
            case '-':
                res = calcInactiveVal - activeVal;
                break;
            case '*':
                res = calcInactiveVal * activeVal;
                break;
            case '/':
                res = calcInactiveVal / activeVal;
                break;
        }
    }

    if (checkOverFlow(res)) {
        calcIsOverFlow = true;
    }
    if (res === NaN) {
        calcIsNaN = true;
    }
    calcInactiveVal = res;
    calcInactiveValFormatted = formatNumber(res);
}

function addEqual() {
    if (isActiveNumberNull() && calcInactiveVal == null) {
        return;
    }
    calcInputMode = false;
    if (!isActiveNumberNull()){
        updateInactiveVal();
        initializeActiveNumber();
    }
    calcOp = '=';
}


function canContinue() {
    return ((!calcIsNaN) && (!calcIsOverFlow));
}



for (const x of calcButtonNameNumerics) {
    let c = (x in calcSignTable)? calcSignTable[x]:x;
    let button = document.querySelector(calcButtonNamePrefix + x);
    button.addEventListener('click', ()=> {
        if (!canContinue()){
            return;
        }
        if (!calcInputMode) {
            initialize();
        }
        addToActiveNumber(c);
        updateDisplay();
    });
}


for (const x of calcButtonNameOperators) {
    let c = (x in calcSignTable)? calcSignTable[x]:x;
    let button = document.querySelector(calcButtonNamePrefix + x);
    button.addEventListener('click', ()=>{
        if (!canContinue()){
            return;
        }
        if (!isActiveNumberNull()){
            updateInactiveVal();
            calcOp = c;
            initializeActiveNumber();
        } else if (calcOp === '='){
            calcOp = c;
            calcInputMode = true
            initializeActiveNumber();        
        }
        updateDisplay();
    })
}


document.querySelector(calcButtonNamePrefix + 'Minus').addEventListener('click', ()=>{
    if (!canContinue()){
        return;
    }
    if (isActiveNumberNull()){
        if (calcInputMode){
            initialize();
            calcSign = -1;
        } else if (calcOp == '=') {
            calcOp = '-';
            calcInputMode = true
            initializeActiveNumber();                 
        }
    } else {
        updateInactiveVal();
        calcOp = '-';
        initializeActiveNumber();
    }
    updateDisplay();
})



document.querySelector(calcButtonNamePrefix + 'Equal').addEventListener('click', ()=>{
    if (!canContinue()){
        return;
    }
    addEqual();
    updateDisplay();
})

document.querySelector(calcButtonNamePrefix + 'Clear').addEventListener('click', ()=>{
    initialize();
})
