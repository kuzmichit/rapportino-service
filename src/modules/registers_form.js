import {validateForm, dateFormat, getRapportinoFromLocal, checkHoursOverflow, showModalError, showReport} from './support.js';
import { renderModalSignIn } from './login';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { getScheduleFromDatabase, authWithEmailAndPassword, submitScheduleInDatabase, getResourceFromDatabase} from './service';

export async function btnRegisterFormHandler(currentDate, evt) {

  const workForm = evt.target.form,
    userData = JSON.parse(localStorage.getItem('userData') ),
    dateFormatted = currentDate.toLocaleString('it', dateFormat),
    currentMonth = currentDate.toLocaleString('it', { month: 'long'} ),
    currentYear = currentDate.getFullYear(),
    main = document.querySelector('.main'),
    registerConsultTabs = document.querySelector('.register-consult__tabs');

  const dataForm = {
    building : workForm.building.value,
    description : workForm.description.value,           
    workedHours : workForm.querySelector('.hour.item_checked') && 
                  workForm.querySelector('.hour.item_checked').textContent
  };

  main.style.display = 'none';
  registerConsultTabs.style.display = 'none';
  const dataForSaveInDatabase = new CreateObjectForDatabase(dateFormatted, dataForm);
  
  if(!validateForm(dataForm) ) return; // controllo riempimento dei campi

  const optionConfirm = {
    title:'Registrare la scheda?',
    messageBody: 'Cantiere: ' + dataForm.building,
    messageWorkedHour:'Ore effettuate: ' + dataForm.workedHours,
    yes: 'Si'
  }; 

  const refreshCalendar = () => {
  document.getElementById('btnSubmit').style.display = ''
  main.style.display = '';
  registerConsultTabs.style.display = '';
  }

  try{
    const idToken = await authWithEmailAndPassword(userData);
    if(!idToken) throw Error(); 
    const _pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?auth=' + idToken;

    console.log(_pathname);

    const currentData = await getScheduleFromDatabase(_pathname);
    if(!currentData) {
      throw Error(); //controllo se si puo memorizzare la scheda
    }

    const itsOverflow = await checkHoursOverflow(currentData, dateFormatted, dataForm);
    if(!itsOverflow) throw Error();

    if(await showPopupToConfirmPutData(optionConfirm, workForm) ) {
      submitScheduleInDatabase(dataForSaveInDatabase, _pathname, dateFormatted, workForm);
    } else { 
      refreshCalendar();
    }

  }       
  catch (error) {
    refreshCalendar();
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
