/*
*   aggiungere lo stato active
*/

import {renderModalSignIn} from './login';
import { autoClickOnElement } from './support';

const bindHandler = () => {
  
  const registrazione = document.querySelector('.register__tab');
  const consultazione = document.querySelector('.consult__tab');

  const callHandler = (element, fn) => {
    element.addEventListener('click', fn);
  };

  const onRegistrazioneClick = () => {
    renderModalSignIn();
    // console.log('register__tab'); 
  }

  const onConsultazioneClick = () => {
    console.log('consult__tab');
  }

  callHandler(registrazione, onRegistrazioneClick)
  callHandler(consultazione, onConsultazioneClick)
  //autoClickOnElement(registrazione); // --------------------------------------------
};

export default bindHandler;