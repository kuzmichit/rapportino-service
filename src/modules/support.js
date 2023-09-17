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

export function deleteNode(collection) {
  while(collection.firstChild) {
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
  return regExp.test(str)?true:false;        
}

export async function showError(message) {

  switch (message) {
  case 'EMAIL_NOT_FOUND':
    showModalError( {messageBody: 'La email non corretta, inserire nuovamente', remove: (node) => node.remove()} );
    
    return 'La email non corretta, inserire nuovamente';
     
  case 'INVALID_PASSWORD':
    showModalError( {messageBody: 'La email non corretta, inserire nuovamente'} );
    
    return 'La password non corretta, inserire nuovamente';

  case ' "TOO_MANY_ATTEMPTS_TRY_LATER':
    return 'Sono fatti troppi tentativi, devi riprovare più tardi';
  default: 
    return 'Errore generico riprova più tardi';
  }
}

export const dateFormat = {
  dateStyle: 'long',
  timeStyle: 'medium',
}; 

export function getRapportinoFromLocal() {

  if(localStorage.getItem('rapportino') === null) localStorage.setItem('rapportino', '{}');
  let rapportino = localStorage.getItem('rapportino');

  return rapportino;
}

export function validateForm( {workedHours, building, description} ) {
  if(!workedHours) {
    return showModalError( {messageBody: 'Scegli le ore effettuate'} );
  }
  else if(!isValid(building) ) {
    return showModalError( {messageBody:'Inserire il nome di cantiere valido'} );
  }
  else if(!isValid(description, /(\w|\s){10,}/) ) {
    return showModalError( {messageBody:'Inserire il lavoro svolto valido' } );
  }

  return true;
}

function isIncludingCurrentDate(rapportino, dateForCompare) {
    
  if(rapportino && JSON.stringify(rapportino).includes(dateForCompare) ) return true;
}

export function checkHoursOverflow(rapportino, dateFormatted, {workedHours} ) {

  const dateForCompare = dateFormatted.slice(0, (dateFormatted.indexOf(202) + 4) );
  if (!isIncludingCurrentDate(rapportino, dateForCompare) ) return true;

  let rapParsed = rapportino;
  let tmpHours = +workedHours;

  for (let key in rapParsed) {
    if(key.includes(dateForCompare) ) {
      tmpHours += +rapParsed[key]['workedHours'];
    }
  }
  if(tmpHours >= 12) {
    alert('E stato superato il limite delle ore');
    
    return false;
  }
  
  return true;
}

export function showModalError(option) {
  let modal = asyncConfirm(option);
  // modal.modalNo.remove();
  console.log(modal);
}

export async function showReport (dateFormatted, workForm) {
  if(await asyncConfirm(
    {title: 'Tutto ok', 
      messageBody: 'La scheda del ' + dateFormatted + ' è stata inserita',
      remove: (node) => node.remove(),
    }
  ) )
    workForm.submit();
}

const autoclickOnElement = element => {

  window.addEventListener('DOMContentLoaded', click);

  function click() { 
    const clickEvent = new Event('click');
    element.dispatchEvent(clickEvent);
  } 
};