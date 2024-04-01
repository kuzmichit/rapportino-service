import { renderModalSignIn } from './login';
import { ConfirmBox, asyncConfirm } from './modal';
const calendar = document.getElementById('calendar');

export const calendarsElements = {
  buttonRight: calendar.querySelector('.button__right'),
  buttonLeft: calendar.querySelector('.button__left'),
  targetCurrent: calendar,
  month: calendar.querySelector('.month'),
  nameBuildingInput: calendar.querySelector('.name-building__input'),
  textArea: calendar.querySelector('#desc'),
  placeToInsert: calendar.querySelector('.list__day'),
  listHour: calendar.querySelector('.list__hour'),
  inputHour: calendar.querySelector('.input__hour'),
  listHourContainer: calendar.querySelector('.list__hour-container')
};

export function camelizeClass(nameClass) {
  let str = nameClass;

  str = str.split('-').join().split(/_{1,2}/).join().split(',');
  let camelizeStr = str[0];

  for (let i = 1; i < str.length; i++) {
    camelizeStr += (str[i][0].toUpperCase() + str[i].slice(1) );
  }

  return camelizeStr;
}

export function deleteNodes(collection) {
  while (collection.firstChild) {
    collection.firstChild.remove();
  }
}

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

export function isUserDataInLocalStorage() {
  return localStorage.getItem('userData') ? true : false;
}

export function isValid(str, regExp = /(\w+\b){1,}/g) {
  return regExp.test(str) ? true : false;
}

export async function showTranslatedError(message) {
  let errorMessage = '';

  switch (message) {
  case 'EMAIL_NOT_FOUND':
    errorMessage = 'L\'email non è corretta, inserire nuovamente.';
    if (await asyncConfirm( { messageBody: errorMessage, no: null } ) )
      renderModalSignIn();
    break;

  case 'INVALID_PASSWORD':
    errorMessage = 'La password non è corretta, inserire nuovamente.';
    if (await asyncConfirm( { messageBody: errorMessage, no: null } ) )
      renderModalSignIn();
    break;

  case 'TOO_MANY_ATTEMPTS_TRY_LATER':
    errorMessage = 'Fatti troppi tentativi, riprova più tardi';
    break;

  case 'NetworkError when attempting to fetch resource.':
    errorMessage = 'Manca il collegamento, riprovare più tardi';
    break;

  default:
    errorMessage = 'Errore generico, riprova più tardi';
  }

  let tmp = await asyncConfirm( { messageBody: errorMessage, no: null } );
  
  return true;
}

export const dateFormat = {
  dateStyle: 'long',
  timeStyle: 'medium',
};

export function getRapportinoFromLocal() {

  if (localStorage.getItem('rapportino') === null) localStorage.setItem('rapportino', '{}');
  let rapportino = localStorage.getItem('rapportino');

  return rapportino;
}

export function validateForm( { workedHours, building, description } ) {

  let errorMessage = '';
  if (!workedHours) {
    errorMessage = 'Scegli le ore effettuate.';
  }

  else if (!isValid(building) ) {
    errorMessage = 'Inserire il nome di cantiere valido.';
  }

  else if (!isValid(description, /(\w|\s){10,}/) ) {
    errorMessage = 'Inserire il lavoro svolto valido.';
  }

  if (errorMessage) {
    asyncConfirm( { messageBody: errorMessage, no: null } );

    return false;
  }

  return true;

}

function isIncludingCurrentDate(rapportino, dateForCompare) {

  if (rapportino && JSON.stringify(rapportino).includes(dateForCompare) ) return true;
  
  return null;
}

export async function checkHoursOverflow(rapportino, dateFormatted, { workedHours } ) {

  const dateForCompare = dateFormatted.slice(0, (dateFormatted.indexOf(202) + 4) );
  if (!isIncludingCurrentDate(rapportino, dateForCompare) ) return true;

  let rapParsed = rapportino;
  let tmpHours = +workedHours;

  for (let key in rapParsed) {
    if (key.includes(dateForCompare) ) {
      tmpHours += +rapParsed[key]['workedHours'];
    }
  }
  if (tmpHours >= 12) {
    if (await asyncConfirm( { messageBody: 'E stato superato il limite delle ore', no: null } ) ) return false;
  }

  return true;
}

export async function showReport(dateFormatted, workForm) {
  if (await asyncConfirm(
    {
      title: 'Tutto ok',
      messageBody: 'La scheda del ' + dateFormatted + ' è stata inserita',
      no: null,
    }
  ) )
    workForm.submit();
}

export const autoClickOnElement = element => {

  window.addEventListener('DOMContentLoaded', click);

  function click() {
    const clickEvent = new Event('click');
    element.dispatchEvent(clickEvent);
    console.log('autoClickOnElement');

  }
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

