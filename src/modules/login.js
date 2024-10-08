/*
* registrazione recupero della password
* premendo login controllare se validi dati

  validi ===> chiudere la finestra, aprire calendario o la finestra consultare
  non validi il messaggio fare conto dei tentativi dopo di tre bloccare
  doppia finestra

** logout
dopo errore render login
   */

import { isValid, deleteNodes, deleteCookie ,autoClickOnElement } from './support.js';
import { asyncConfirm } from './modal.js';
import { authWithEmailAndPassword, signInWithGoogle } from './firebase/auth_service.js';
import { showSignedUser, onLogoutHandler } from './logging_user.js';

const insertNode = document.querySelector('.temp__container'),
      loader = document.querySelector('.loader'),
      headerToHidden = document.querySelector('.header__hidden'),
      signBlock = document.querySelector('.sign-block'),
      signBlockSpan = signBlock.querySelector('.sign__name > span'),
      headerTitle = document.querySelector('.header__title');
let tabToShow = '';

export function renderModalSignIn(chosenTab) {
  tabToShow = chosenTab;
  const modalSignIn = `<section class="login__container">
  <form onsubmit="return false;" id="login-form" class="login-form "><h1>Login</h1>
    <div class="form-input-material">
      <input type="text" name="email" placeholder=" " autocomplete="off" required="required" class="form-control-material" />
      <label for="username">Email</label></div>
    <div class="form-input-material">
      <input type="password" name="password" placeholder=" " autocomplete="off" required="required" class="form-control-material" />
      <span class="visualizzare-password" data-action='showPassword'><span class="visually-hidden visualizzare-password-barra" data-action='showPassword'>&#92</span></span>
      <label for="password">Password</label>
    </div>
    <button id='sign-in' name="btn-ghost" type="submit" class="btn btn-ghost" onclick="return false" data-action='onLogin'>Login</button>
    <h4 class="password__lost" data-action='lostPassword'>Password dimenticata?</h4>
    <p>Oppure</p>
    <button type="button" data-action='onGoogle' class="login-with-btn google-btn-wrapper" >
      Accedi con Google
    </button>
    <button id='facebook-btn' data-action='onFacebook' type="button" class="login-with-btn facebook-btn">
      Accedi con Facebook 
    </button>
    <div id="buttonGoogle" type="button" class="button-google"></div>
    <hr />
    <p class="register__text">Non hai un account? <a href="#" id="new-account"> Crea un account</a> per accedere a
      tutti i servizi
      online</p>
  </form>
</section>`;

  insertNode.insertAdjacentHTML('beforeend', modalSignIn);
  headerToHidden.classList.add('visually-hidden');

  initLoginForm();
}

function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  new FormLoginHandler(loginForm);
}

function UserData(email, password) {
  this.email = email.trim().toLowerCase(),
  this.password = password;
}

export const bindLogout = () => {
  const logout = document.querySelector('.logout');
  logout.addEventListener('click', onLogoutHandler);
};

const btnHandle = async (callback, arg) => {

  insertNode.classList.add('visually-hidden');
  loader.classList.remove('visually-hidden');
  const idToken = await callback(arg);
  if (!idToken) return null;

  loader.classList.add('visually-hidden');
  headerToHidden.classList.remove('visually-hidden');
  deleteNodes(insertNode);
  tabToShow.classList.remove('visually-hidden');
  showSignedUser();
  
  return true;
}

async function btnLoginHandler() {
  
  const loginForm = document.getElementById('login-form'),
        email = loginForm.elements.email.value.trim().toLowerCase(),
        password = loginForm.elements.password.value,
        expForEmail = /(^\w+)@(\w+)\.[A-Za-z]{2,3}$/;

  if (!isValid(email, expForEmail) ) {
    await asyncConfirm( { messageBody: 'L\'email non è corretta', no: null } ) 
    
    return null;
  }
  if (!isValid(password) ) {
    await asyncConfirm( { messageBody: 'La password non è corretta', no: null } ) 
      
    return null;
  }

  const userData = new UserData(email, password);
  const result = await authWithEmailAndPassword(userData);
  
  return result
}

class FormLoginHandler {
  constructor(form, activeTab) {
    this._form = form;
    this._activeTab = activeTab
    this.eye = form.querySelector('.visualizzare-password')
    this.eyeOverScore = form.querySelector('.visualizzare-password-barra')
    this.password = form.elements.password
    this.onClick = this.onClick.bind(this); // Bind del metodo onClick
    this._form.addEventListener('click', this.onClick);
  }

  async onLogin() {
    this.rmClick();

    try {

      const result = await btnHandle(btnLoginHandler);
      if (!result) throw 'Result undefined'
      bindLogout()
    }
    catch (error) {
      console.log(error, '---error onLogin');
      this.restoreStateOfForm();
    }
  }

  async onGoogle() {
    this.rmClick(); 
    try {
      const result = await btnHandle(signInWithGoogle)
      if (!result) this.restoreStateOfForm();
      bindLogout()
    }
    catch (error) {
      console.log('error onGoogle');
      this.restoreStateOfForm();
    }
  }

  onFacebook() {
    console.log('facebook');
  }

  rmClick() {
    this._form.removeEventListener('click', this.onClick);
  }

  restoreStateOfForm() {
    this._form.addEventListener('click', this.onClick);
    loader.classList.add('visually-hidden');
    insertNode.classList.remove('visually-hidden')
  }

  onClick(event) {
    const { action } = event.target.dataset;
    if (action) {
      this[action]();
    }
  }

  showPassword() {
    this.eyeOverScore.classList.toggle('visually-hidden')
    this.password.type = (this.password.type === 'text') ? 'password' : 'text';
  }

  lostPassword() {
    console.log('Password dimenticata');
  }
}
