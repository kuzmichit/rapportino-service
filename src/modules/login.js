import { isValid } from './support.js';

export function initLoginForm() {

  const formLogin = document.getElementById('login-form');
  let btnGhost = formLogin['btn-ghost'];
  btnGhost.addEventListener('pointerdown', btnLoginHandler);
}

function UserData(email, password) {
  this.email = email,
  this.password = password;
}

function saveUserDataInSessionStorage(userData) {
  localStorage.setItem('userData', JSON.stringify(userData) );
}

function btnLoginHandler() {

  const formLogin = document.getElementById('login-form'),
    email = formLogin.email.value,
    password = formLogin.password.value,
    expForEmail = /(^\w+)@(\w+)\.[A-Za-z]{2,3}$/;

  if(!isValid(email, expForEmail) ) {
    alert('L\'email non valida');

    return;
  }
  if(!isValid(password) ) {
    alert('La password non valida');

    return;
  }

  let userData = new UserData(email, password);
  saveUserDataInSessionStorage(userData);
  
  document.querySelector('.submit__button').style.display = '';
  document.querySelector('.modal__container').style.display = 'none';
  document.querySelector('.main__container').style = 'filter: blur(10px)';
  
}
