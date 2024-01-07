/* 
* aggiungere la croce di chiusura del modal
* registrazione recupero della password 
* sistemare doppio login
*/

import { isValid, deleteNodes, autoClickOnElement } from './support.js';
import {asyncConfirm} from './modal.js';
import {authWithEmailAndPassword} from './service.js';

const insertNode = document.querySelector('.temp__container'),
  headerToHidden = document.querySelector('.header__hidden');

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
      <h4 class="password__lost">Password dimenticata?</h4>
      <hr />
      <p class="register__text">Non hai un account? <a href="#" id="new-account"> Crea un account</a> per accedere a
        tutti i servizi
        online</p>
    </form></section>`;

  insertNode.insertAdjacentHTML('beforeend', modalSignIn);
  headerToHidden.classList.add('visually-hidden');
  
  initLoginForm();
}

function initLoginForm() {
  const btnLogin = document.getElementById('sign-in');
  btnLogin.addEventListener('click', () => btnLoginHandler(btnLogin) );
}

function UserData(email, password) {
  this.email = email,
  this.password = password;
}

const saveUserDataInSessionStorage = userData => {
  localStorage.setItem('userData', JSON.stringify(userData) );
}

async function btnLoginHandler(btnLogin) {
  insertNode.classList.toggle('visually-hidden');

  const formLogin = document.getElementById('login-form'),
    email = formLogin.email.value,
    password = formLogin.password.value,
    expForEmail = /(^\w+)@(\w+)\.[A-Za-z]{2,3}$/;
    
  if(!isValid(email, expForEmail) ) {
    if(await asyncConfirm( {messageBody: 'L\'email non è corretta', no: null} ) ) insertNode.classList.toggle('visually-hidden');
    
    return;
  }
  if(!isValid(password) ) {
    if(await asyncConfirm( {messageBody: 'La password non è corretta', no: null} ) ) insertNode.classList.toggle('visually-hidden');
    
    return;
  }

  const userData = new UserData(email, password),
    getToken = authWithEmailAndPassword(),
    idToken = await getToken(userData);
  if(!idToken) { btnLogin.disabled = false; }
  else {
    deleteNodes(insertNode)
    document.getElementById('calendar').classList.remove('visually-hidden')
    headerToHidden.classList.remove('visually-hidden')
  }

  console.log('clickbtn')  

  /* premendo login controllare se validi dati
  validi ===> chiudere la finestra, aprire calendario o la finestra consultare
  non validi il messaggio fare conto dei tentativi dopo di tre bloccare

   */
  
  // document.querySelector('.submit__button').style.display = '';
  // document.querySelector('.modal__container').style.display = 'none';
  // document.querySelector('.main__container').style = 'filter: blur(10px)';
  
}
