/*
* registrazione recupero della password
* premendo login controllare se validi dati

  validi ===> chiudere la finestra, aprire calendario o la finestra consultare
  non validi il messaggio fare conto dei tentativi dopo di tre bloccare
  doppia finestra

** logout
dopo errore render login
   */

import { isValid, deleteNodes, deleteCookie /* autoClickOnElement */ } from './support.js';
import { asyncConfirm } from './modal.js';
import { authWithEmailAndPassword, btnGoogleHandler } from './firebase/auth_service.js';

const insertNode = document.querySelector('.temp__container'),
      loader = document.querySelector('.loader'),
      headerToHidden = document.querySelector('.header__hidden'),
      signBlock = document.querySelector('.sign-block'),
      signBlockSpan = signBlock.querySelector('.sign__name > span'),
      logoutBtn = document.querySelector('.logout'),
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
      <span class="visualizzare-password" data-action='showPassword'></span>
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
  this.email = email,
  this.password = password;
}

export const showSignedUser = () => {
  const userEmail = JSON.parse(sessionStorage.getItem('userData') );

  if (userEmail) {
    signBlock.classList.remove('visually-hidden');
    signBlockSpan.textContent = userEmail.email.slice(0, userEmail.email.indexOf('@') );
    headerTitle.style.justifyContent = 'space-between';
  }
};

async function btnLoginHandler() {
  insertNode.classList.add('visually-hidden');

  const formLogin = document.getElementById('login-form'),
        email = formLogin.elements.email.value,
        password = formLogin.elements.password.value,
        expForEmail = /(^\w+)@(\w+)\.[A-Za-z]{2,3}$/;

  if (!isValid(email, expForEmail) ) {
    if (await asyncConfirm( { messageBody: 'L\'email non è corretta', no: null } ) ) insertNode.classList.remove('visually-hidden');

    return null;
  }
  if (!isValid(password) ) {
    if (await asyncConfirm( { messageBody: 'La password non è corretta', no: null } ) ) insertNode.classList.remove('visually-hidden');

    return null;
  }

  const userData = new UserData(email, password);

  try {
    loader.classList.remove('visually-hidden');
    const idToken = await authWithEmailAndPassword(userData);
    if (!idToken) throw Error();

    loader.classList.add('visually-hidden');
    headerToHidden.classList.remove('visually-hidden');
    deleteNodes(insertNode);
    tabToShow.classList.remove('visually-hidden');
    logoutBtn.classList.remove('visually-hidden');
    showSignedUser();
    
    return true;
  }
  catch (error) {
    console.error(error);
    loader.classList.add('visually-hidden');

    return null;
  }
}

export const bindLogout = () => {
  const logout = document.querySelector('.logout');
  logout.addEventListener('click', onLogoutHandler);
};

const onLogoutHandler = () => {
  try {
    signBlock.classList.add('visually-hidden');
    signBlockSpan.textContent = '';
    headerTitle.style.justifyContent = 'center';
    sessionStorage.clear();
    deleteCookie('g_state');
    location.reload();
    console.log('logout ok');
  }
  catch (error) { () => console.error(error); }
};

class FormLoginHandler {
  constructor(form, activeTab) {
    this._form = form;
    this._activeTab = activeTab
    this.eye = form.querySelector('.visualizzare-password')
    this.password = form.elements.password
    this.onClick = this.onClick.bind(this); // Bind del metodo onClick
    this._form.addEventListener('click', this.onClick);
  }

  async onLogin() {
    this.rmClick();
    const result = await btnLoginHandler();
    if (!result) this.restoreStateOfForm();
  }

  async onGoogle() {
    this.rmClick();
    try {
      const result = await btnGoogleHandler()
      if (!result) this.restoreStateOfForm();
    }
    catch (error) {
      console.log('error onGoogle');
    }
    // TODO: fare restore google
  }

  onFacebook() {
    console.log('facebook');
  }

  rmClick() {
    this._form.removeEventListener('click', this.onClick);
  }

  restoreStateOfForm() {
    this._form.addEventListener('click', this.onClick);
    console.log('restore');
  }

  onClick(event) {
    const { action } = event.target.dataset;
    if (action) {
      this[action]();
    }
  }

  showPassword() {
    this.password.type = (this.password.type === 'text') ? 'password' : 'text';
    console.log(this.password.type);
  }

  lostPassword() {
    console.log('Password dimenticata');
  }
}
