const pw = document.querySelector('#password');
const cpw = document.querySelector('#confirmpw');
const pwm = document.querySelector('#password + span')

function showPWerrorMessage(m){
    pwm.textContent = m;
}


function processPasswordCheck(event) {
    let m = 'Passwords do not match!';
    if (pw.value != undefined && pw.value === cpw.value) {
        m = '';
    }
    pw.setCustomValidity(m);
    cpw.setCustomValidity(m);
    showPWerrorMessage(m);
}

pw.addEventListener('input', processPasswordCheck);
cpw.addEventListener('input', processPasswordCheck);