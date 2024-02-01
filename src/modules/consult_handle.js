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
  userData = JSON.parse(localStorage.getItem('userData') );

  const onBtnHandler = async (e) => {
    e.preventDefault()
   
    if(inputDate.value === '' && selectMesi.value === 'Scegliere il mese') { 
      await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} )
      console.log(selectMesi.value)
      return null
    }
    let searchData = inputDate.value || selectMesi.value
   

    try{
      const idToken = await authWithEmailAndPassword(userData);
      if(!idToken) throw Error(); 
      console.log('fired')
      
  
      const currentData = await getResourceFromDatabase(idToken, searchData);
      if(!currentData) {
        throw Error();
      }
      console.log(currentData)
      
    }       
    catch (error) {
      // document.getElementById('btnCerca').disabled = false;
    }

    // btnCerca.disabled = true

    // console.log(inputDate.value === 'a')
  }

  btnCerca.addEventListener('click', onBtnHandler);

}

export default consultHandle;