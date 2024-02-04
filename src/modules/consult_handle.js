/* 
** fare la fetch alla data base con gli argomenti scelti
** rendere i dati ricevuti
 */
import {asyncConfirm} from './modal.js';
import { getResourceFromDatabase, authWithEmailAndPassword } from './service.js';
import { dateFormat, autoClickOnElement } from './support.js';

const consultHandle = () => {

 const form = document.querySelector('#consulting'),
  btnCerca = form.elements.cerca,
  inputDate = form.elements.date,
  selectMesi = form.elements.mesi,
  userData = JSON.parse(localStorage.getItem('userData') );

  const onBtnHandler = async (e) => {
    e.preventDefault()
    let URL_pathname;

    if(inputDate.value !== '') {
      const date = new Date(inputDate.value),
        localeDate = date.toLocaleString('it', dateFormat ),
        posForTrim = localeDate.indexOf('alle'),
        searchDate = localeDate.slice(0, posForTrim - 1).replaceAll(' ', '%20'),
        currentYear = date.getFullYear();

        URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + searchDate + '.json?auth=';
    }
    else if(selectMesi.value !== 'Scegliere il mese') { 

      const currentYear = new Date().getFullYear();
      URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + selectMesi.value.toLowerCase() + '.json?auth=';

    } else { 
      await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} )
    }

    try{
      const idToken = await authWithEmailAndPassword(userData);
      if(!idToken) throw Error(); 
       
      URL_pathname += idToken;
      // TODO: 
      //let searchData = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?auth=' + idToken;;

      const currentData = await getResourceFromDatabase(URL_pathname);
      if(!currentData) {
        throw Error();
      }

      console.log(currentData)
      
    }       
    catch (error) {
      // document.getElementById('btnCerca').disabled = false;
      console.log('errore');
    }

    // btnCerca.disabled = true

    // console.log(inputDate.value === 'a')
  }

  btnCerca.addEventListener('click', onBtnHandler);
  autoClickOnElement(btnCerca)

}

export default consultHandle;