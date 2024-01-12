/*
*  aggiungere lo stato active
*/

import {renderModalSignIn} from './login';
import { autoClickOnElement } from './support';

const apiKey = process.env.API_KEY;

const bindHandler = () => {
  
  const registrazione = document.querySelector('.register__tab'),
    consultazione = document.querySelector('.consult__tab'),
    headerToHidden = document.querySelector('.header__hidden');

  const checkUserInStorage = () => {
    let result = (JSON.parse(sessionStorage.getItem('userData') ) !== null) ? true : false
    
    return result
    
  }

  const callHandler = (element, fn) => {
    element.addEventListener('click', fn);
  };

  const onRegistrazioneClick = () => {
    console.log(process.env)

    if(checkUserInStorage() ) {
      document.getElementById('calendar').classList.remove('visually-hidden')
      headerToHidden.classList.remove('visually-hidden')
      
    }
    else {
      renderModalSignIn();
    }
  }

  const onConsultazioneClick = () => {
    if(checkUserInStorage() ) return
    renderModalSignIn();
    console.log('consult__tab');
  }

  callHandler(registrazione, onRegistrazioneClick)
  callHandler(consultazione, onConsultazioneClick)
  //autoClickOnElement(registrazione); // --------------------------------------------
};

export default bindHandler;