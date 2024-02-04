/* 
** fare la fetch alla data base con gli argomenti scelti
** rendere i dati ricevuti
 */
import {asyncConfirm} from './modal.js';
import { getResourceFromDatabase, authWithEmailAndPassword } from './service.js';

const consultHandle = () => {
 const form = document.querySelector('#consulting'),
  btnCerca = form.elements.cerca,
  inputDate = form.elements.date,
  selectMesi = form.elements.mesi,
  userData = JSON.parse(localStorage.getItem('userData') ),
  currentDate = new Date(),
  currentMonth = currentDate.toLocaleString('it', { month: 'long'} ),
  currentYear = currentDate.getFullYear();

  const onBtnHandler = async (e) => {
    e.preventDefault()
   
    if(inputDate.value === '' && selectMesi.value === 'Scegliere il mese') { 
      await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} )
      console.log(selectMesi.value)
      return null
    }
    
    
    //let searchData = inputDate.value || selectMesi.value
    
    
    try{
      const idToken = await authWithEmailAndPassword(userData);
      if(!idToken) throw Error(); 
      console.log('fired')
      
      // const _pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?auth=' + idToken;
      // TODO: 
      let searchData = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?auth=' + idToken;;

      const currentData = await getResourceFromDatabase(searchData);
      if(!currentData) {
        throw Error();
      }
      console.log(111);
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

}

export default consultHandle;