/* 
** fare la fetch alla data base con gli argomenti scelti
** rendere i dati ricevuti
 */
import {asyncConfirm} from './modal.js';
import { getResourceFromDatabase, authWithEmailAndPassword } from './service.js';
import { dateFormat, autoClickOnElement } from './support.js';

const consultHandle = () => {

 const form = document.querySelector('#consulting'),
  btnCerca = form.elements.cerca,
  inputDate = form.elements.date,
  selectMesi = form.elements.mesi,
  userData = JSON.parse(localStorage.getItem('userData') );

  const onBtnHandler = async (e) => {
    e.preventDefault()
    let URL_pathname;
    let dataToRender;
    
    const render = dataToRender => {

      const tempContainer = document.querySelector('.temp__container');
      const createTbody = () => {

        let tbody = '<tbody>'
        const entries = Object.entries(dataToRender)

        let rows = entries.reduce( (row,item) => {
          row += `<tr><td>${item[0].slice(0, item[0].indexOf('alle') - 6)}</td><td>${item[1].workedHours}</td><td>${item[1].building}</td><td>${item[1].description}</td></tr>`;

          return row;
        }, '' )

        tbody += rows + '</tbody>'

        return tbody;
      }
      
      let totalHours = 0;
      for(let item in dataToRender) {
        totalHours += +item.hours;
      }

      let table = `<table><thead><tr><th>Data</th><th class="render__hours">Ore </th><th class="render__building">Cantiere</th><th>Discrezione</th></tr></thead>`

      table += createTbody();
      
      table += `</tr></tbody><tfoot><tr><th scope="row" colspan="3">Ore totale</th><td class="total__hours">${totalHours}</td></tr></tfoot></table>`

      console.log(table);
      tempContainer.insertAdjacentHTML('beforeend', table)
    }

    if(inputDate.value !== '') {
      const date = new Date(inputDate.value),
        localeDate = date.toLocaleString('it', dateFormat ),
        posForTrim = localeDate.indexOf('alle'),
        searchingDate = date.getDate(),
        currentYear = date.getFullYear(),
        currentMonth = date.toLocaleString('it', {month: 'long'} ),
        _queryPath = `orderBy="$key"&startAt="${searchingDate} "&endAt="${searchingDate + 1 } "`

        URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?' + _queryPath + '&auth='; 
    }
    else if(selectMesi.value !== 'Scegliere il mese') { 

      const currentYear = new Date().getFullYear();
      URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + selectMesi.value.toLowerCase() + '.json?auth=';

    } else { 
      await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} )
    }

    try{
      const idToken = await authWithEmailAndPassword(userData);
      if(!idToken) throw Error(); 
       
      URL_pathname += idToken;
  
      dataToRender = await getResourceFromDatabase(URL_pathname);
      if(!dataToRender) {
        throw Error();
      }

      //render(dataToRender);  
    }       
    catch (error) {
      // document.getElementById('btnCerca').disabled = false;
      console.log('errore-------', error);
    }

    // btnCerca.disabled = true
  }

  btnCerca.addEventListener('click', onBtnHandler);
  // autoClickOnElement(btnCerca)

}

export default consultHandle;