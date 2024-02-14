/*
** sistemare render fra le tab 
** settare il mese precedente
** crea nuove istanze consult
*/

import {renderModalSignIn} from './login'
import { autoClickOnElement } from './support'
import consultHandle from './consult_handle'

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
    headerToHidden = document.querySelector('.header__hidden'),
    calendar = document.getElementById('calendar'),
    consultazioneForm = document.getElementById('consulting');

  const checkUserInStorage = () => {
    let result = (JSON.parse(sessionStorage.getItem('userData') ) !== null) ? true : false
    
    return result
    
  }

  const addHandler = (element, fn) => {
    element.addEventListener('click', fn)
  }
  const rmHandler = (element, fn) => {
    element.removeEventListener('click', fn)
  }

  const onRegistrazioneClick = () => {
    removeActive()
    setActive(registrazione)

    if(checkUserInStorage() ) {
      calendar.classList.remove('visually-hidden')
      headerToHidden.classList.remove('visually-hidden')
      consultazioneForm.classList.add('visually-hidden')
      rmHandler(registrazione, onRegistrazioneClick)
      addHandler(consultazione, onConsultazioneClick)
    }
    else {
      renderModalSignIn()
    }
  }

  const onConsultazioneClick = () => {
    removeActive()
    setActive(consultazione)
    
    if(checkUserInStorage() )  {
      consultazioneForm.classList.remove('visually-hidden')
      calendar.classList.add('visually-hidden')
      rmHandler(consultazione, onConsultazioneClick)
      addHandler(registrazione, onRegistrazioneClick)
    }
    else renderModalSignIn()
 
  }

  addHandler(registrazione, onRegistrazioneClick)
  addHandler(consultazione, onConsultazioneClick)
  autoClickOnElement(consultazione); // --------------------------------------------
}
export default bindHandler;