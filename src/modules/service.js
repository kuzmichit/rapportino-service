import config from './../config';
import {showTranslatedError, getRapportinoFromLocal, showReport} from './support.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { renderModalSignIn } from './renders.js';
const promise = new Promise( (resolve, reject) => {
  resolve('ok');
} );

//const configURLs= { _baseURL: 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com'};
const emulatorConfigURLs = {
  _databaseURL: 'http://127.0.0.1:9000/',
  _pathToResource: 'rapportino-service',
  _URL() { return this._databaseURL + this._pathToResource; },
  _urlAuth: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword' // manca la d
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

export function authWithEmailAndPassword() {

  let idToken = '';
  let timePreviousRun = null;

  return async function( {email, password} ) {
    if(timePreviousRun || timePreviousRun > (Date.now() - 3500) ) { 
      
      return idToken ;
    }
    try {
      let response = await fetch(`${emulatorConfigURLs._urlAuth}?key=${config._API_KEY}`, {
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
      } );
      let data = await response.json();
      if(data && data.error) throw data.error; 
      
      idToken = data.idToken;
      timePreviousRun = data;

      return idToken;
    }
    catch (error) {
      if(400 <= error.code && 500 > error.code) {
        showTranslatedError(error.message);     
      } 
    }
 
  }; 
}

export const submitScheduleInDatabase = (dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {
  fetch(`${emulatorConfigURLs._databaseURL}${emulatorConfigURLs._pathToResource}/${currentMonth}.json?auth=${idToken}`,
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
      if(!response.ok) throw Error(); 
    } ) 
    .then( () => {
      showReport(dateFormatted, workForm);
      saveDataInLocalStorage(dataForSaveInDatabase, dateFormatted); 
    } )
    .catch( ()=> asyncConfirm( {messageBody: 'Errore generico, riprova più tardi.', no: null} ) ) ;
};

export async function getScheduleFromDatabase(idToken, currentMonth) {
  try {
    const response = await fetch(`${emulatorConfigURLs._databaseURL}${emulatorConfigURLs._pathToResource}/${currentMonth}.json?auth=${idToken}`);
    if(!response.ok) throw Error(response.error);
    const data = await response.json();

    if(data !== null) return data;
    
    return true;
  }
  catch (error) {
    asyncConfirm( { bodyMessage: error.message, no: null } );
    
    Promise.resolve(false);
  }
} 

function saveDataInLocalStorage(data, dateFormatted) {
  let rapportino = JSON.parse(getRapportinoFromLocal() );
  
  rapportino[dateFormatted] = {...data[dateFormatted]};
  localStorage.setItem('rapportino', JSON.stringify(rapportino) );
} 