import {checkFillField, isValid, showError, dateFormat, getRapportinoFromLocal, checkHoursOverflow, errorMessage, showReport} from './support.js';
import { renderModalSignIn } from './renders.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import config from '../config.js';

console.log(config);
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
  
  if(!checkFillField(dataForm) ) {
    return; 
  }

  const optionConfirm = {
    title:'Registrare la scheda?',
    messageBody: 'Cantiere: ' + dataForm.building,
    messageWorkedHour:'Ore effettuate: ' + dataForm.workedHours,
    yes: 'Si'
  }; 

  try{
    const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzODBlZjEyZjk1ZjkxNmNhZDdhNGNlMzg4ZDJjMmMzYzIzMDJmZGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbGEtc2NlZGEtZGktbGF2b3JvIiwiYXVkIjoibGEtc2NlZGEtZGktbGF2b3JvIiwiYXV0aF90aW1lIjoxNjkyMzYxNzc3LCJ1c2VyX2lkIjoibU0wOVRTbHlEbWI4RVZ4ZEx0OGJKOXlsQzF5MSIsInN1YiI6Im1NMDlUU2x5RG1iOEVWeGRMdDhiSjl5bEMxeTEiLCJpYXQiOjE2OTIzNjE3NzcsImV4cCI6MTY5MjM2NTM3NywiZW1haWwiOiJ6dWNjYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsienVjY2FAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.I_52VS0YonhiHLfMRdbXNgZ8nS68NJSbSLzApr3Chus0Bb6DpN_RsBIo0q5Il_pSlX1b_ofa9mgFEj5xCFWvwFeX-Z4kjxPOqMhYzVKjNnxhPSzwG15IG1tm-70lCV4MJx3mnK2oa6kVJGVrT7-oBA5jLqEPr3LECUIlQCkrVMVGno8EuVNGeI5wMhJDWO-F_ysokzzL-R3ihHlBmB-gKoac2izWan0Z-waPaArGyjGfEZSG_61vwOMaryeDqjppKx4eJRR20NZJP_B2gcTkGEsTEA1bFFECFqzvOceaok3z1lknSv0mmPdjyPW4rWV8eC5u8G9Hu29oNL2sIyRK0w';

    // const idToken = await authWithEmailAndPassword(userData);
  
    const currentData = await getScheduleFromDatabase(idToken, currentMonth)
    //controllo se si puo memorizzare la scheda
      .then(data => {
        if(checkHoursOverflow(data, dateFormatted, dataForm) ) {
          
          renderConfirm(optionConfirm, dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm); 
        } 
      } ); 
  }      
  catch(e) { alert('La scheda non salvata'); }
}

function CreateObjectForDatabase(date, {building, description, workedHours} ) {

  this[`${date}`] =
     {
       building,
       description,
       workedHours,
     };
}

function authWithEmailAndPassword(userData) {
  const apiKey = 'AIzaSyDMLR1XYP9NpvZbXZbBxBLEWB1Ssx528ms';

  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify( {
      email:userData.email,
      password: userData.password,
      returnSecureToken: true
    } ) ,
    headers: {
      'Content-Type': 'application/json'
    }
  } )
    .then(response => response.json() )
    .then(response => {
      if(response && response.error) throw response.error;

      return response;
    } 
    )
    .then(data => {
      return data.idToken;
    } )
    .catch(error => {

      if(400 <= error.code && 500 > error.code) {
        showError(error.message, ConfirmBox);
        renderModalSignIn();
      } 
    }
    );
}

const submitScheduleInDatabase = (dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {
  fetch(`https://la-sceda-di-lavoro-default-rtdb.firebaseio.com/rapportinoBorys/${currentMonth}.json?auth=${idToken}`,
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
    .catch( (e) => errorMessage(ConfirmBox, {messageBody: e = 'Qualcosa non va, riprova più tardi' } ) );
}; 

function saveDataInLocalStorage(data, dateFormatted) {
  let rapportino = JSON.parse(getRapportinoFromLocal() );
  
  rapportino[dateFormatted] = {...data[dateFormatted]};
  localStorage.setItem('rapportino', JSON.stringify(rapportino) );
} 

function getScheduleFromDatabase(idToken, currentMonth) {

  return fetch(`https://la-sceda-di-lavoro-default-rtdb.firebaseio.com/rapportinoBorys/${currentMonth}.json?auth=${idToken}`)
    .then(response => response.json() )
    .catch(error => alert(error.message) );
}

const renderConfirm = async (optionConfirm, dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {

  if (await asyncConfirm(optionConfirm, workForm) ) {
    submitScheduleInDatabase(dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm);
    saveDataInLocalStorage(dataForSaveInDatabase, dateFormatted); 
  };

};
