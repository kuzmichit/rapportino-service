import {validateForm, dateFormat, getRapportinoFromLocal, checkHoursOverflow, showModalError, showReport} from './support.js';
import { renderModalSignIn } from './login.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { getScheduleFromDatabase, submitScheduleInDatabase, getResourceFromDatabase} from './firebase/service.js';

export async function btnRegisterFormHandler(currentDate, evt) {

  const workForm = evt.target.form,
        userData = JSON.parse(sessionStorage.getItem('userData') ),
        dateFormatted = currentDate.toLocaleString('it', dateFormat),
        dateToIndexFirebase = currentDate.toISOString().slice(0, 10),
        currentMonth = currentDate.toLocaleString('it', { month: 'long'} ),
        currentYear = currentDate.getFullYear(),
        main = document.querySelector('.main'),
        loader = document.querySelector('.loader'),
        registerConsultTabs = document.querySelector('.register-consult__tabs');

  const dataForm = {
    building : workForm.building.value,
    description : workForm.description.value,           
    workedHours : workForm.querySelector('.hour.item_checked') && 
                  workForm.querySelector('.hour.item_checked').textContent
  };

  main.style.display = 'none';
  registerConsultTabs.style.display = 'none';
  const dataForSaveInDatabase = new CreateObjectForDatabase(dateFormatted, dataForm, dateToIndexFirebase);
  
  if(!validateForm(dataForm) ) return null; // controllo riempimento dei campi

  const optionConfirm = {
    title:'Registrare la scheda?',
    messageBody: 'Cantiere: ' + dataForm.building,
    secondRow: 'La data: ' + dateToIndexFirebase,
    messageWorkedHour:'Ore effettuate: ' + dataForm.workedHours,
    yes: 'Si'
  }; 

  const refreshCalendar = () => {
    document.getElementById('btnSubmit').style.display = '';
    main.style.display = '';
    registerConsultTabs.style.display = '';
  };

  try{
    loader.classList.remove('visually-hidden'); 
    
    const idToken = await JSON.parse(sessionStorage.getItem('idToken') );
    if(!idToken) throw Error(); 

    const _pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?auth=' + idToken;
    const currentData = await getResourceFromDatabase(_pathname);
    if (!currentData) { throw Error() }
    //controllo se si puo memorizzare la scheda

    const itsOverflow = await checkHoursOverflow(currentData, dateFormatted, dataForm);
    if (!itsOverflow) throw Error();

    loader.classList.add('visually-hidden');    
    if(await showPopupToConfirmPutData(optionConfirm) ) { 
      loader.classList.remove('visually-hidden');
      await submitScheduleInDatabase(dataForSaveInDatabase, _pathname, dateFormatted, workForm);
      loader.classList.add('visually-hidden');
    }
    else {
      refreshCalendar()
    }

  }       
  catch (error) {
    refreshCalendar();
    loader.classList.add('visually-hidden');
    console.log('btnRegisterFormHandler ++++++', error);
  }

  return null
}

class CreateObjectForDatabase {
  constructor(date, { building, description, workedHours }, dateToIndexFirebase) {

    this[`${date}`] =
    {
      building,
      description,
      workedHours,
      date: dateToIndexFirebase,
    };
  }
}

const showPopupToConfirmPutData = async (optionConfirm, workForm) => {
  if (await asyncConfirm(optionConfirm, workForm) ) return true;
  
  return false;  
};
