
import { showTranslatedError } from '../support.js';
const emulatorConfigURLs = {
  _hostname: 'http://127.0.0.1:9000/',
  _pathname: 'zucca@gmailcom',
  _search: '?search',
  _hash: '#hash',
  _URL() { return this._hostname + this._pathname; },
  _urlAuth: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
  _orderByDay: '21 settembre 2023'
};
// eslint-disable-next-line no-undef
const apiKey = process.env._API_KEY;

const saveIdTokenDataInSessionStorage = (data, userData = null) => {
  sessionStorage.setItem('idToken', JSON.stringify(data.idToken) );
  sessionStorage.setItem('refreshToken', JSON.stringify(data.refreshToken) );
  sessionStorage.setItem('timePreviousRun', JSON.stringify(Date.now() ) );
  if (userData) sessionStorage.setItem('userData', JSON.stringify(userData) );

}

export const authWithEmailAndPassword = async ( { email, password } ) => {

  let idToken = '';
  let refreshToken = '';
  const timePreviousRun = JSON.parse(sessionStorage.getItem('timePreviousRun') );

  if (timePreviousRun > (Date.now() - 350000) ) {
    idToken = JSON.parse(sessionStorage.getItem('idToken') );

    return idToken;
  }

  const url = `${emulatorConfigURLs._urlAuth}?key=${apiKey}`
  const body = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify( {
      email: email,
      password: password,
      returnSecureToken: true
    } ),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    let response = await fetch(url, body);
    let data = await response.json();
    if (data && data.error) throw data.error;

    idToken = data.idToken;
    // Salvare i dati di idToken
    saveIdTokenDataInSessionStorage(data, { email, password } );

    return idToken;
  }
  catch (error) {
    if (400 <= error.code && 500 > error.code) {
      showTranslatedError(error.message);
    }
    else { showTranslatedError(error.message) }
  }

  return null;
};

export const signInWithIdp = async (access_token, providerId = 'google.com') => {
  let idToken = '';

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( {
      'postBody': `id_token=${access_token}&providerId=${providerId}`,
      'requestUri': 'http://localhost',
      'returnIdpCredential': true,
      'returnSecureToken': true
    },
    )
  };

  try {
    let response = await fetch(url, fetchData);
    let data = await response.json();
    if (data && data.error) throw data.error;

    idToken = data.idToken;
    // Salvare i dati di idToken
    saveIdTokenDataInSessionStorage(data)

    return idToken;
  }
  catch (error) {
    if (400 <= error.code && 500 > error.code) {
      showTranslatedError(error.message);
    }
    else (showTranslatedError(error.message) );
  }

  return null;
  
}

const loadGoogleIdentityServices = () => {
  return new Promise( (resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append('beforeend', script);
  } )
}
    
export const btnGoogleHandler = async () => {
  return new Promise( (resolve, reject) => {
    const handleCredentialResponse = async (res) => {
      try {
        const access_token = await res.credential;
        const tokenId = await signInWithIdp(access_token);
        resolve(true); // Indica che l'operazione è riuscita
      }
      catch (error) {
        console.error('Errore durante la gestione della risposta delle credenziali:', error);
        reject(false); // Indica che l'operazione non è riuscita
      }
    };

    loadGoogleIdentityServices()
      .then( () => {
      // eslint-disable-next-line no-undef
        google.accounts.id.initialize( {
          client_id: '482515197259-4kfbochdgiikcpgkivj6jcthvocetpbc.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: true,
        } );

        // eslint-disable-next-line no-undef
        google.accounts.id.prompt(); // Visualizza anche il dialogo One Tap
      } )
      .catch( (error) => {
        console.error('Errore durante il caricamento delle risorse di Google Identity Services:', error);
        reject(false); // Indica che l'operazione non è riuscita
      } );
  } );
};

