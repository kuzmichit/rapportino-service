import {validateForm, dateFormat, checkHoursOverflow} from './support.js';
import {asyncConfirm} from './modal.js';
import {submitScheduleInDatabase, getResourceFromDatabase} from './firebase/service.js';

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

  const restoreInitState = () => {
    refreshCalendar();
    loader.classList.add('visually-hidden');
  }

  try {
    loader.classList.remove('visually-hidden'); 
    
    const idToken = await JSON.parse(sessionStorage.getItem('idToken') );
    if (!idToken) {
      restoreInitState()
      throw 'non id_token'
    }

    const _pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?auth=' + idToken;
    const currentData = await getResourceFromDatabase(_pathname);

    //controllo se si puo memorizzare la scheda
    if (currentData !== null) {
      const itsOverflow = await checkHoursOverflow(currentData, dateFormatted, dataForm);
      if (itsOverflow) {
        restoreInitState();
        
        return null;
      }
    }
    
    loader.classList.add('visually-hidden');    
    if (await showPopupToConfirmPutData(optionConfirm) ) {
      loader.classList.remove('visually-hidden');
      await submitScheduleInDatabase(dataForSaveInDatabase, _pathname, dateFormatted, workForm)
      loader.classList.add('visually-hidden');
    }
    else restoreInitState();
   
  }       
  catch (error) {
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
