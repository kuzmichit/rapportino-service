/* 
* aggiungere la croce di chiusura del modal
* registrazione recupero della password 
*/

import { isValid } from './support.js';

export function renderModalSignIn() {
  let modalSignIn = `<section class="login__container">
  <form onsubmit="return false;" id="login-form" class="login-form "><h1>Login</h1>
    <div class="form-input-material">
      <input type="text" name="email" placeholder=" " autocomplete="off" required="required" class="form-control-material" />
      <label for="username">Email</label></div>
    <div class="form-input-material">
      <input type="password" name="password" placeholder=" " autocomplete="off" required="required" class="form-control-material" />
      <label for="password">Password</label>
    </div>
    <button id='sign-in' name="btn-ghost" type="submit" class="btn btn-ghost" onclick="return false">Login</button>
  </form>
</section>`;

  const insertNode = document.querySelector('.temp__container');
  insertNode.insertAdjacentHTML('beforeend', modalSignIn);
  document.querySelector('.header__hidden').classList.add('visually-hidden');

  initLoginForm();
  console.log(document.getElementById('sign-in') ) 

}

function initLoginForm() {

  const btnLogin = document.getElementById('sign-in');
  btnLogin.addEventListener('click', btnLoginHandler);
}

function UserData(email, password) {
  this.email = email,
  this.password = password;
}

function saveUserDataInSessionStorage(userData) {
  localStorage.setItem('userData', JSON.stringify(userData) );
}

function btnLoginHandler() {
  console.log('click')
  /*  
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
  document.querySelector('.main__container').style = 'filter: blur(10px)'; */
  
}
