import config from './../config';
import {showTranslatedError, getRapportinoFromLocal, showReport} from './support.js';
import {asyncConfirm, ConfirmBox} from './modal.js';
import { renderModalSignIn } from './renders.js';

//const configURLs= { _baseURL: 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com'};
const emulatorConfigURLs = {
  _hostname: 'http://127.0.0.1:9000/',
  _pathname: 'rapportino-service',
  _search: '?search',
  _hash: '#hash',
  _URL() { return this._hostname + this._pathname; },
  _urlAuth: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', // manca la d
  _orderByDay: '21 settembre 2023'
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

export const authWithEmailAndPassword = () => {

  let timePreviousRun = JSON.parse(sessionStorage.getItem('timePreviousRun') );
  let idToken = JSON.parse(sessionStorage.getItem('idToken') );

  return async function( {email, password} ) {
    if(timePreviousRun > (Date.now() - 350000) ) { 
      
      return idToken ;
    }
    try {
      let response = await fetch(`${emulatorConfigURLs._urlAuth}?key=${process._API_KEY}`, {
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
      sessionStorage.setItem('idToken', JSON.stringify(idToken) );
      sessionStorage.setItem('timePreviousRun', JSON.stringify(Date.now() ) );

      return idToken;
    }
    catch (error) {
      if(400 <= error.code && 500 > error.code) {
        showTranslatedError(error.message);     
      }
      else(showTranslatedError(error.message) );
    }
 
  }; 
};

export const submitScheduleInDatabase = async (dataForSaveInDatabase, dateFormatted, currentMonth, idToken, workForm) => {
  try {
    const response = await fetch(`${emulatorConfigURLs._hostname}${emulatorConfigURLs._pathname}/${currentMonth}.json?auth=${idToken}`,
      {
        method: 'PATCH',
        body: JSON.stringify(dataForSaveInDatabase),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
    if(!response.ok) throw Error();
    showReport(dateFormatted, workForm);
    saveDataInLocalStorage(dataForSaveInDatabase, dateFormatted); 
  }
  catch(error) { 
    showTranslatedError(error.message); 
  } 
};

export const getScheduleFromDatabase = async (idToken, currentMonth) => {
  try {
    const response = await fetch(`${emulatorConfigURLs._hostname}${emulatorConfigURLs._pathname}/${currentMonth}.json?auth=${idToken}`);
    if(!response.ok) throw Error();
    const data = await response.json();

    if(data !== null) return data;
    
    return true;
  }
  catch (error) {
    showTranslatedError(error.message); 
  } 
}; 

function saveDataInLocalStorage(data, dateFormatted) {
  let rapportino = JSON.parse(getRapportinoFromLocal() );
  
  rapportino[dateFormatted] = {...data[dateFormatted]};
  localStorage.setItem('rapportino', JSON.stringify(rapportino) );
} 

export const getResourceFromDatabase = async (idToken) => {
  try {
    const response = await fetch(`${emulatorConfigURLs._hostname}/dinosaurs.json?orderBy="height"&startAt=3&print=pretty`);
    if(!response.ok) throw Error();
    const data = await response.json();
    console.log(data);
    if(data !== null) return data;
    
    return true;
  }
  catch (error) {
    showTranslatedError(error.message); 
  } 
};