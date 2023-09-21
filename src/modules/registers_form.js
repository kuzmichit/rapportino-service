import {validateForm, dateFormat, getRapportinoFromLocal, checkHoursOverflow, showModalError, showReport} from './support.js';
import { renderModalSignIn } from './renders.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { getScheduleFromDatabase, authWithEmailAndPassword, submitScheduleInDatabase} from './service';

export async function btnRegisterFormHandler(currentDate, evt) {

  const workForm = evt.target.form,
    userData = JSON.parse(localStorage.getItem('userData') ),
    dateFormatted = currentDate.toLocaleString('it', dateFormat),
    currentMonth = currentDate.toLocaleString('it', { month: 'long'} );
  
  const dataForm = {
    building : workForm.building.value,
    description : workForm.description.value,           
    workedHours : workForm.querySelector('.hour.item_checked') && 
                  workForm.querySelector('.hour.item_checked').textContent
  };

  const dataForSaveInDatabase = new CreateObjectForDatabase(dateFormatted, dataForm);
  
  if(!validateForm(dataForm) ) return; // controllo riempimento dei campi

  const optionConfirm = {
    title:'Registrare la scheda?',
    messageBody: 'Cantiere: ' + dataForm.building,
    messageWorkedHour:'Ore effettuate: ' + dataForm.workedHours,
    yes: 'Si'
  }; 

  try{
    
    const getToken = authWithEmailAndPassword(),
      idToken = await getToken(userData);
    if(!idToken) throw new Error(); 

    const currentData = await getScheduleFromDatabase(idToken, currentMonth);
    if(!currentData) {
      throw Error(); //controllo se si puo memorizzare la scheda
    }
    const itsOverflow = await checkHoursOverflow(currentData, dateFormatted, dataForm);
    if(!itsOverflow) throw Error();
    if(await showPopupToConfirmPutData(optionConfirm, workForm) ) {
      
      submitScheduleInDatabase(dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm);
    } 

  }       
  catch (error) {
    document.getElementById('btnSubmit').disabled = false;
    alert(error);
  }
}

function CreateObjectForDatabase(date, {building, description, workedHours} ) {

  this[`${date}`] =
     {
       building,
       description,
       workedHours,
     };
}

const showPopupToConfirmPutData = async (optionConfirm, workForm) => {
  if (await asyncConfirm(optionConfirm, workForm) ) return true;
  
  return false;  
};
