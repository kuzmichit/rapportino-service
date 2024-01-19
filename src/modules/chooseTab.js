/*
* aggiungere contenuto active
*/

import {renderModalSignIn} from './login'
import { autoClickOnElement } from './support'

const apiKey = process.env._API_KEY
const setActive = elem => {
  elem.classList.add('active-tab')
}
const removeActive = () => {
  const activeTab = document.querySelectorAll('.active-tab')
  activeTab.forEach(elem => { 
    elem.classList.remove('active-tab') 
  } )
}

const bindHandler = () => {
  
  const registrazione = document.querySelector('.register__tab'),
    consultazione = document.querySelector('.consult__tab'),
    headerToHidden = document.querySelector('.header__hidden')

  const checkUserInStorage = () => {
    let result = (JSON.parse(sessionStorage.getItem('userData') ) !== null) ? true : false
    
    return result
    
  }

  const callHandler = (element, fn) => {
    element.addEventListener('click', fn)
  }

  const onRegistrazioneClick = () => {
    removeActive()
    setActive(registrazione)

    if(checkUserInStorage() ) {
      document.getElementById('calendar').classList.remove('visually-hidden')
      headerToHidden.classList.remove('visually-hidden')
      
    }
    else {
      renderModalSignIn()
    }
  }

  const onConsultazioneClick = () => {
    removeActive()
    setActive(consultazione)
    if(checkUserInStorage() ) return
    renderModalSignIn()
  }

  callHandler(registrazione, onRegistrazioneClick)
  callHandler(consultazione, onConsultazioneClick)
  //autoClickOnElement(registrazione); // --------------------------------------------
}

export default bindHandler