const textInHeader = document.querySelector('.calendar-header__text');
const nameMonths = ['Gennaio', ' Febbraio', ' Marzo', ' Aprile', ' Maggio', ' Giugno', ' Luglio', ' Agosto', ' Settembre', ' Ottobre', ' Novembre', ' Dicembre'];

export function renderDay(curDate, curMonth) {
  if(curDate) textInHeader.textContent = curDate.getDate() + nameMonths[curDate.getMonth()];
  else textInHeader.textContent = nameMonths[curMonth.getMonth()] +' '+ curMonth.getFullYear() ;
}

