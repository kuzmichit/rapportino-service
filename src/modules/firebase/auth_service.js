const emulatorConfigURLs = {
  _hostname: 'http://127.0.0.1:9000/',
  _pathname: 'zucca@gmailcom',
  _search: '?search',
  _hash: '#hash',
  _URL() { return this._hostname + this._pathname; },
  _urlAuth: 'http://localhost:9090/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
  _orderByDay: '21 settembre 2023'
};
const apiKey = process.env._API_KEY;

export const authWithEmailAndPassword = async ( {email, password} ) => {
 
  let idToken = '';
  const timePreviousRun = JSON.parse(sessionStorage.getItem('timePreviousRun') );

  if(timePreviousRun > (Date.now() - 350000) ) { 
    idToken = JSON.parse(sessionStorage.getItem('idToken') );
      
    return idToken ;
  }

  const url = `${emulatorConfigURLs._urlAuth}?key=${apiKey}`
  const body = {
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
  }

  try {
    let response = await fetch(url, body);
    let data = await response.json();
    if(data && data.error) throw data.error; 
      
    idToken = data.idToken;
    // Salvare i dati di idToken
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

  return null;
}; 

export const signInWithIdp = (access_token, providerId ='google.com') => {
  let idToken;
  
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`;
  const postData = {
    'postBody': `id_token=${access_token}&providerId=${providerId}`,
    'requestUri': 'http://localhost',
    'returnIdpCredential': true,
    'returnSecureToken': true
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
  .then(response => response.json())
  .then(data => {
    idToken = data.access_token;
    console.log('Sign-in with IdP successful:', idToken);
    // Handle user authentication success
  })
  .catch(error => {
    console.error('Error signing in with IdP:', error); // TODO: render modal error
    // Handle error
  });
}
export const bindHandleGoogle = () => {
  const googleBtn = document.querySelector('.google-btn-wrapper');
  window.addEventListener('click', initGoogleAuth);
  console.log("bind");
}

const initGoogleAuth = () => {
  
    google.accounts.id.initialize({
      client_id: "482515197259-4kfbochdgiikcpgkivj6jcthvocetpbc.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      auto_select: true,
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonGoogle"),
      { theme: "outline", size: "small" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
    }

  const handleCredentialResponse = async (res) => {
    const getToken = () => {
      let access_token = res.credential;
      return access_token;
    }
    let access_token =  await getToken();

    console.log(access_token);
    // signInWithIdp(access_token)
  }



  