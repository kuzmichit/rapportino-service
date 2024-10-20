/*
** sistemare render fra le tab 
** settare il mese precedente
** 
*/
import { renderModalSignIn } from './login';
import { showSignedUser } from './logging_user.js';
import { autoClickOnElement, deleteNodes } from './support.js';
import { exchangeRefreshTokenForIdToken } from './firebase/auth_service';
import onBtnCercaHandler from './consult_handle.js';

showSignedUser()
const addHandler = (element, fn) => {
  element.addEventListener('click', fn);
};
const rmHandler = (element, fn) => {
  element.removeEventListener('click', fn);
};
const setActive = elem => {
  elem.classList.add('active-tab');
};
const removeActive = () => {
  const activeTab = document.querySelectorAll('.active-tab');
  activeTab.forEach(elem => {
    elem.classList.remove('active-tab');
  } );
};
const registrazione = document.querySelector('.register__tab'),
      consultazione = document.querySelector('.consult__tab'),
      headerToHidden = document.querySelector('.header__hidden'),
      calendar = document.getElementById('calendar'),
      consultazioneForm = document.getElementById('consulting'),
      tempContainer = document.querySelector('.temp__container'),
      btnCerca = consultazioneForm.elements.cerca;

const bindHandlerChooseTab = () => {

  registrazione.addEventListener('click', onRegistrazioneClick)
  consultazione.addEventListener('click', onConsultazioneClick)
  addHandler(registrazione, onRegistrazioneClick);
  addHandler(consultazione, onConsultazioneClick);
}

const checkUserSignedIn = () => {
   
  let userData = JSON.parse(localStorage.getItem('userData') ),
        timePreviousRun = JSON.parse(localStorage.getItem('timePreviousRun') );
  let idToken = JSON.parse(localStorage.getItem('idToken') );
  
  if (userData && timePreviousRun && idToken) {
    if (timePreviousRun > (Date.now() - 3500000) ) return true;
    if (exchangeRefreshTokenForIdToken() ) return true;
  }

  return null
};

const onRegistrazioneClick = () => { 
  removeActive();
  deleteNodes(tempContainer)

  if (checkUserSignedIn() ) { 
    showSignedUser();
    setActive(registrazione);
    calendar.classList.remove('visually-hidden');
    headerToHidden.classList.remove('visually-hidden');
    consultazioneForm.classList.add('visually-hidden');
    rmHandler(registrazione, onRegistrazioneClick);
    rmHandler(btnCerca, onBtnCercaHandler)
    addHandler(consultazione, onConsultazioneClick);
  }
  else {
    renderModalSignIn(calendar);
    setActive(registrazione);
  }
};

const onConsultazioneClick = () => {
  removeActive();
  addHandler(btnCerca, onBtnCercaHandler)
    
  if (checkUserSignedIn() ) {
    setActive(consultazione);
    showSignedUser();
    headerToHidden.classList.remove('visually-hidden');
    consultazioneForm.classList.remove('visually-hidden');
    calendar.classList.add('visually-hidden');
    rmHandler(consultazione, onConsultazioneClick);
    addHandler(registrazione, onRegistrazioneClick);
  }
  else {
    renderModalSignIn(consultazioneForm);
    setActive(consultazione);
  }
};
autoClickOnElement(registrazione); // --------------------------------------------
  
export default bindHandlerChooseTab;