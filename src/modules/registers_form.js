import {validateForm, dateFormat, getRapportinoFromLocal, checkHoursOverflow, showModalError, showReport} from './support.js';
import { renderModalSignIn } from './renders.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { getScheduleFromDatabase, authWithEmailAndPassword} from './service';

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
  
  if(!validateForm(dataForm) ) { // controllo riempimento dei campi
    return; 
  }

  const optionConfirm = {
    title:'Registrare la scheda?',
    messageBody: 'Cantiere: ' + dataForm.building,
    messageWorkedHour:'Ore effettuate: ' + dataForm.workedHours,
    yes: 'Si'
  }; 

  try{
    
    const getToken = authWithEmailAndPassword(),
      idToken = await getToken(userData);
    if(!idToken) return;
    const currentData = await getScheduleFromDatabase(idToken, currentMonth), //controllo se si puo memorizzare la scheda
      itsOverflow = checkHoursOverflow(currentData, dateFormatted, dataForm);

    if(itsOverflow) showPopupToConfirmPutData(optionConfirm, dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm); 
  }       
  catch (error) {
    console.log(error); // { "error": 400 }
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

const submitScheduleInDatabase = (dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {
  fetch(`http://127.0.0.1:9000/rapportino-service/${currentMonth}.json?auth=${idToken}`,
    {
      method: 'PATCH',
      body: JSON.stringify(dataForSaveInDatabase),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      showReport(dateFormatted, workForm);
    } )

    .catch( (e) => showModalError( {messageBody: 'Qualcosa non va, riprova più tardi' } ) );
}; 

function saveDataInLocalStorage(data, dateFormatted) {
  let rapportino = JSON.parse(getRapportinoFromLocal() );
  
  rapportino[dateFormatted] = {...data[dateFormatted]};
  localStorage.setItem('rapportino', JSON.stringify(rapportino) );
} 

const showPopupToConfirmPutData = async (optionConfirm, dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {
  if (await asyncConfirm(optionConfirm, workForm) ) {
    submitScheduleInDatabase(dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm);
    debugger;
    saveDataInLocalStorage(dataForSaveInDatabase, dateFormatted); 
  }

};
