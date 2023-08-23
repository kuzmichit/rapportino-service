import { initLoginForm } from './login.js';

const textInHeader = document.querySelector('.calendar-header__text');
const nameMonths = ['Gennaio', ' Febbraio', ' Marzo', ' Aprile', ' Maggio', ' Giugno', ' Luglio', ' Agosto', ' Settembre', ' Ottobre', ' Novembre', ' Dicembre'];

export function renderDay(curDate, curMonth) {
  if(curDate) textInHeader.textContent = curDate.getDate() + nameMonths[curDate.getMonth()];
  else textInHeader.textContent = nameMonths[curMonth.getMonth()] +' '+ curMonth.getFullYear() ;
}

export function renderModalSignIn() {
  let modalSignIn = `<div class="modal__container"><form onsubmit="return false;" id="login-form" class="login-form"><h1>Login</h1><div class="form-input-material">
    <input type="text" name="email" placeholder=" " autocomplete="off" required="required" class="form-control-material" />
    <label for="username">Email</label></div><div class="form-input-material">
    <input type="password" name="password" placeholder=" " autocomplete="off" required="required" class="form-control-material" />
   <label for="password">Password</label></div><button name="btn-ghost" type="submit" class="btn btn-ghost">Login</button></form></div>`;

  const insertingElem = document.querySelector('.main__container');
  insertingElem.insertAdjacentHTML('afterend', modalSignIn);
  insertingElem.style = 'filter: blur(0.5rem)';

  initLoginForm();
}
