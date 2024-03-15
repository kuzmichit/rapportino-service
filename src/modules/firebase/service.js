/*
** 
*/
import {showTranslatedError, getRapportinoFromLocal, showReport} from '../support.js';
import {asyncConfirm, ConfirmBox} from '../modal.js';
import { renderModalSignIn } from '../login.js';

//const configURLs= { _baseURL: 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com'};
const emulatorConfigURLs = {
  _hostname: 'http://127.0.0.1:9000/',
  _pathname: 'zucca@gmailcom',
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

// export const authWithEmailAndPassword = async ( {email, password} ) => {
//   const apiKey = process.env._API_KEY;
//   const timePreviousRun = JSON.parse(sessionStorage.getItem('timePreviousRun') );
//   let idToken = '';

//   if(timePreviousRun > (Date.now() - 350000) ) { 
//     idToken = JSON.parse(sessionStorage.getItem('idToken') );
      
//     return idToken ;
//   }

//   try {
//     let response = await fetch(`${emulatorConfigURLs._urlAuth}?key=${apiKey}`, {
//       method: 'POST',
//       mode: 'cors',
//       body: JSON.stringify( {
//         email: email,
//         password: password,
//         returnSecureToken: true
//       } ) ,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     } );
//     let data = await response.json();
//     if(data && data.error) throw data.error; 
      
//     idToken = data.idToken;
//     sessionStorage.setItem('idToken', JSON.stringify(idToken) );
//     sessionStorage.setItem('timePreviousRun', JSON.stringify(Date.now() ) );

//     return idToken;
//   }
//   catch (error) {
//     if(400 <= error.code && 500 > error.code) {
//       showTranslatedError(error.message);     
//     }
//     else(showTranslatedError(error.message) );
//   }

//   return null;
// }; 

export const submitScheduleInDatabase = async (dataForSaveInDatabase, _pathname, dateFormatted, workForm) => 
{
 try {
    const response = await fetch(`${emulatorConfigURLs._hostname}${_pathname}`,
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
    // saveDataInLocalStorage(dataForSaveInDatabase, dateFormatted);
  }
  catch(error) { 
    showTranslatedError(error.message); 
  } 
};

export const getScheduleFromDatabase = async (_pathname) => {
  try {
    const response = await fetch(`${emulatorConfigURLs._hostname}${_pathname}`);
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

export const fetchWithAccessToken = (params) => {
                  
  fetch('https://rapportino-service-default-rtdb.asia-southeast1.firebasedatabase.app/dinosaurs.json?access_token=' + access_token)
.then(response => response.json())
.then(data => {
// Usa i dati della risposta qui
console.log(data);
})
.catch(error => {
// Gestisci gli errori qui
console.error(error);
});
}

export const getResourceFromDatabase = async (_pathname) => {
  try {
    const response = await fetch(`${emulatorConfigURLs._hostname}${_pathname}`);
    if(!response.ok) throw Error();

    const data = await response.json();
    //console.log(data); //==================================== log
    if(data !== null) return data;
  }
  catch (error) {
    showTranslatedError(error.message);
 
    return null;
  } 
};

/* function saveDataInLocalStorage(data, dateFormatted) {
  let rapportino = JSON.parse(getRapportinoFromLocal() );
  
  rapportino[dateFormatted] = {...data[dateFormatted]};
  localStorage.setItem('rapportino', JSON.stringify(rapportino) );
}

ricerca dinosauri const response = await fetch(`${emulatorConfigURLs._hostname}scores.json?orderBy="$value"& startAt=50`);*/