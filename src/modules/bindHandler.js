/*
*   
*/

import {renderModalSignIn} from './login';
const bindHandler = () => {
  
  const registrazione = document.querySelector('.register__tab');
  const consultazione = document.querySelector('.consult__tab');

  const callHandler = (element, fn) => {
    element.addEventListener('pointerdown', fn);
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
};

export default bindHandler;