import config from './../config';
import {translateErrorText, getRapportinoFromLocal, showModalError, showReport} from './support.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { renderModalSignIn } from './renders.js';
const promise = new Promise( (resolve, reject) => {
  resolve('ok');
} );

//const configURLs= { _baseURL: 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com'};
const emulatorConfigURLs = {
  _databaseURL: 'http://127.0.0.1:9000/database/rapportino-service',
  _pathToResource: 'rapportino-service',
  _URL() { return this._databaseURL + this._pathToResource; },
  _urlAuth: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'
};

// const fetchArguments = {
//   _baseURL: 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com',
//   _pathToResource: 'rapportinoBorys',
//   method: 'GET',
//   body: null,
//   headers: {'Content-Type': 'application/json'},
//   getURL() {
//     return this._baseURL + this._pathToResource;
//   }
// };

export function authWithEmailAndPassword( {email, password} ) {

  let idToken = '';
  let timePreviousRun = null;

  return function() {
    debugger;
    if(timePreviousRun && timePreviousRun > Date.now() - 3500) { 
      console.log('object');
      
      return idToken ;
    }
    fetch(`${emulatorConfigURLs._urlAuth}?key=${config._API_KEY}`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify( {
        email: email,
        password: password,
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
        idToken = data.idToken;
        timePreviousRun = data;
        
        return data.idToken;
      } )
      .catch(error => {
        if(400 <= error.code && 500 > error.code) {
          let errorText = translateErrorText(error.message);
          console.log(error);
          
          return errorText;
          // if( error.message === 'INVALID_PASSWORD' || error.message === 'EMAIL_NOT_FOUND' ) renderModalSignIn();
        } 
      } ); 
  };
}

// const showPopupToConfirmPutData = async () => {

//       if (await asyncConfirm(optionConfirm, workForm) ) {
//         alert('fired')
//       }
export const submitScheduleInDatabase = (dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {
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
    .catch( (e) => {return e; } ) ;
};

export async function getScheduleFromDatabase(idToken, currentMonth = 'agosto') {
  try {
    const response = await fetch(`${emulatorConfigURLs._databaseURL}/${currentMonth}.json?auth=${idToken}`);
    
    return await response.json();
  }
  catch (error) {
    return alert(error.message);
  }
} 