
import { deleteNodes, deleteCookie, autoClickOnElement } from './support.js';

const signBlock = document.querySelector('.sign-block'),
      headerTitle = document.querySelector('.header__title'),
      headerText = headerTitle.querySelector('.header__text');
      
const render = (text, justifyContent) => {
  headerText.textContent = `Rapportino di ${text}`
  headerTitle.style.justifyContent = justifyContent;
}

export const onLogoutHandler = () => {
  try {
    render('lavoro giornaliero', 'center')
    signBlock.classList.add('visually-hidden');
    localStorage.clear();
    deleteCookie('g_state');  
    location.reload();
    console.log('logout ok');
  }
  catch (error) {
    console.log(error, '--onLogoutHandler')
  }
};

export const showSignedUser = () => {

  try {
    const userEmail = JSON.parse(localStorage.getItem('userData') );
       
    if (userEmail) {
      const userName = userEmail.email.slice(0, 1).toUpperCase() + userEmail.email.slice(1, userEmail.email.indexOf('@') );
      signBlock.classList.remove('visually-hidden');
      render(userName, 'space-between')
    }
    
  }
  catch (error) {
    console.log(error, '--showSignedUser');
  }
};