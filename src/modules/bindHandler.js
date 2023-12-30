/* 
*
 */

const bindHandler = (selector) => {
  
  const registrazione = document.querySelector('.register__tab');
  const consultazione = document.querySelector('.consult__tab');

  const callHandler = (element, fn) => {
    element.addEventListener('pointerdown', fn);
  };

  const onRegistrazioneClick = () => {
    console.log('register__tab'); 
  }

  const onConsultazioneClick = () => {
    console.log('consult__tab');
    
  }
};

default export bindHandler;