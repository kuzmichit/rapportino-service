/*
** sistemare render fra le tab 
** settare il mese precedente
** 
*/
import { renderModalSignIn } from './login';
import { showSignedUser } from './login';
import { autoClickOnElement } from './support';
import consultHandle from './consult_handle';
import { exchangeRefreshTokenForIdToken } from './firebase/auth_service';

showSignedUser()
const setActive = elem => {
  elem.classList.add('active-tab');
};
const removeActive = () => {
  const activeTab = document.querySelectorAll('.active-tab');
  activeTab.forEach(elem => {
    elem.classList.remove('active-tab');
  } );
};

const bindHandlerChooseTab = () => {

  const registrazione = document.querySelector('.register__tab'),
        consultazione = document.querySelector('.consult__tab'),
        headerToHidden = document.querySelector('.header__hidden'),
        calendar = document.getElementById('calendar'),
        consultazioneForm = document.getElementById('consulting');

  const checkUserSignedIn = () => {
   
    let userData = JSON.parse(sessionStorage.getItem('userData') ),
          timePreviousRun = JSON.parse(sessionStorage.getItem('timePreviousRun') );
    let idToken = JSON.parse(sessionStorage.getItem('idToken') );
  
    if (userData && timePreviousRun && idToken) {
      // if (timePreviousRun > (Date.now() - 3500000) ) return true;
      if (exchangeRefreshTokenForIdToken() ) return true;
    }

    return null
  };

  const addHandler = (element, fn) => {
    element.addEventListener('click', fn);
  };
  const rmHandler = (element, fn) => {
    element.removeEventListener('click', fn);
  };

  const onRegistrazioneClick = () => {
    removeActive();
    setActive(registrazione);

    if (checkUserSignedIn() ) { // TODO: check refresh token
      showSignedUser();
      calendar.classList.remove('visually-hidden');
      headerToHidden.classList.remove('visually-hidden');
      consultazioneForm.classList.add('visually-hidden');
      rmHandler(registrazione, onRegistrazioneClick);
      addHandler(consultazione, onConsultazioneClick);
    }
    else {
      renderModalSignIn(calendar);
    }
  };

  const onConsultazioneClick = () => {
    removeActive();
    setActive(consultazione);

    if (checkUserSignedIn() ) {
      showSignedUser();
      headerToHidden.classList.remove('visually-hidden');
      consultazioneForm.classList.remove('visually-hidden');
      calendar.classList.add('visually-hidden');
      rmHandler(consultazione, onConsultazioneClick);
      addHandler(registrazione, onRegistrazioneClick);
    }
    else {
      renderModalSignIn(consultazioneForm);
    }
  };

  addHandler(registrazione, onRegistrazioneClick);
  addHandler(consultazione, onConsultazioneClick);
  // autoClickOnElement(registrazione); // --------------------------------------------
};
export default bindHandlerChooseTab;