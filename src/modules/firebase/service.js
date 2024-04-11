/*
** 
*/
import {showTranslatedError, getRapportinoFromLocal, showReport} from '../support.js';
import {asyncConfirm, ConfirmBox} from '../modal.js';
import { renderModalSignIn } from '../login.js';

/*const configURLs= { _baseURL: 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com'};
  const emulatorConfigURLs = {
  _hostname: 'http://127.0.0.1:9000/',
  _pathname: 'zucca@gmailcom',
  _search: '?search',
  _hash: '#hash',
  _URL() { return this._hostname + this._pathname; },
  _urlAuth: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', // manca la d
  _orderByDay: '21 settembre 2023'
};*/

const configURLs = {
  _hostname: 'https://rapportino-service-default-rtdb.asia-southeast1.firebasedatabase.app',
  _search: '?search',
  _hash: '#hash',
  _URL() { return this._hostname + this._pathname; },
  _orderByDay: '21 settembre 2023'
};

export const submitScheduleInDatabase = async (dataForSaveInDatabase, _pathname, dateFormatted, workForm) => {
  try {
    const response = await fetch(`${configURLs._hostname}/${_pathname}`,
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
  }
  catch(error) { 
    showTranslatedError(error.message);
    console.log('submitScheduleInDatabase ++++', error.message);
    
    throw error
  } 

  return true
};

export const getScheduleFromDatabase = async (_pathname) => {
  try {
    const response = await fetch(`${configURLs._hostname}/${_pathname}`);
    if(!response.ok) throw Error();
    const data = await response.json();

    if(data !== null) return data;
    
    return true;
  }
  catch (error) {
    showTranslatedError(error.message);
 
    return null;
  } 
}; 

export const getResourceFromDatabase = async (_pathname) => {
  try {
    const response = await fetch(`${configURLs._hostname}/${_pathname}`);
    if(!response.ok) throw Error();

    const data = await response.json();
    if(data !== null) return data;
  }
  catch (error) {
    showTranslatedError(error.message);
    
    throw error
  }
  
  return null;
};