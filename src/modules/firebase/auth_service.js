
import * as jose from 'jose'
import { showTranslatedError } from '../support.js';

const configURLs = {
  _hostname: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts',
  _hostnameToken: 'http://localhost:9090/securetoken.googleapis.com/v1/',
  _pathname: 'zucca@gmailcom',
  _search: '?search',
  _hash: '#hash',
  _URL() { return this._hostname + this._pathname; },
  _urlAuthWithPsd: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
  _urlAuthWithGoogleAcc: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accountstoken',
  _orderByDay: '21 settembre 2023'
};

/* const configURLs = {
  _hostname: 'https://identitytoolkit.googleapis.com/v1/accounts',
  _hostnameToken: 'https://identitytoolkit.googleapis.com/v1/',
  _pathname: 'zucca@gmailcom',
  _search: '?search',
  _hash: '#hash',
}; */
// eslint-disable-next-line no-undef
const apiKey = process.env._API_KEY;

const saveIdTokenDataInSessionStorage = (data, userData = null) => {
  sessionStorage.setItem('idToken', JSON.stringify(data.idToken) );
  sessionStorage.setItem('refreshToken', JSON.stringify(data.refreshToken) );
  sessionStorage.setItem('timePreviousRun', JSON.stringify(Date.now() ) );
  if (userData) sessionStorage.setItem('userData', JSON.stringify(userData) );

}

const showError = async (error) => {
  if (400 <= error.code && 500 > error.code) {
    await showTranslatedError(error.message)
  }
  else await showTranslatedError(error.message)

  return null;
}

export const authWithEmailAndPassword = async ( { email, password } ) => {

  let idToken = '';

  const url = `${configURLs._hostname}:signInWithPassword?key=${apiKey}`
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
    saveIdTokenDataInSessionStorage(data, { email } );

    return idToken;
  }
  catch (error) {
    await showError(error) 
    console.log('authWithEmailAndPassword++++++', error)
  }
  
  return null;
};

export const signInWithIdp = async (access_token, providerId = 'google.com') => {
  let idToken = '';

  const url = `${configURLs._hostname}:signInWithIdp?key=${apiKey}`;
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
    const decodedJWT = jose.decodeJwt(access_token)
    const userData = {
      email: decodedJWT.email
    }

    let response = await fetch(url, fetchData);
    let data = await response.json();
    if (data && data.error) throw data.error;

    idToken = data.idToken;
    // Salvare i dati di idToken
    saveIdTokenDataInSessionStorage(data, userData)

    return idToken;
  }
  catch (error) {
    await showError(error)
    console.log('signInWithIdp ++++++');
    
    return null
  }
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
    
export const signInWithGoogle = async () => {

  return new Promise( (resolve, reject) => {
    const handleCredentialResponse = async (res) => {
      try {
        const JWT = await res.credential;
        const idToken = await signInWithIdp(JWT);
        if (!idToken) throw 'Oops'
        resolve(true);
        // Indica che l'operazione è riuscita
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
          use_fedcm_for_prompt: true,
        } );

        // eslint-disable-next-line no-undef
        google.accounts.id.prompt(); // Visualizza anche il dialogo One Tap
      } )
      .catch(async () => {
        await showError( { message: 'NetworkError when attempting to fetch resource.' } )
        
        /* TODO: dopo 10 sec  controllare stato
        if (typeof google !== 'undefined' && google.accounts !== 'undefined' && google.accounts.id !== 'undefined') {
          // Library is already loaded, you can use it here
      }*/
        
        reject(false); // Indica che l'operazione non è riuscita
      } );
  } );
};

export const exchangeRefreshTokenForIdToken = async () => { // TODO: cambiare la data expire

  let refreshToken = sessionStorage.getItem('refreshToken')
  if (refreshToken !== 'undefined' && refreshToken !== null && refreshToken !== '') {
    refreshToken = JSON.parse(refreshToken)
  }

  const url = `${configURLs._hostnameToken}token?key=${apiKey}`;
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  };
  
  try {
    const response = await fetch(url, fetchData);
    const data = await response.json();
    if (data && data.error) throw data.error;

    const newData = {
      idToken: data.id_token,
      refreshToken: data.refresh_token
    }
    saveIdTokenDataInSessionStorage(newData)
    
    return data;
  }
  catch (error) {
    await showError(error)
    console.log('exchangeRefreshTokenForIdToken--------');
  }
  
  return null;
}

