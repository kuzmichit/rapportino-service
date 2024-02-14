/* 
** 
** 
 */
import {asyncConfirm} from './modal.js';
import { getResourceFromDatabase, authWithEmailAndPassword } from './service.js';
import { dateFormat, autoClickOnElement, deleteNodes } from './support.js';

const consultHandle = () => {

 const form = document.querySelector('#consulting'),
  btnCerca = form.elements.cerca,
  inputDate = form.elements.date,
  selectMesi = form.elements.mesi,
  userData = JSON.parse(localStorage.getItem('userData') ),
  tempContainer = document.querySelector('.temp__container');

  const onBtnHandler = async (e) => {
    deleteNodes(tempContainer)
    e.preventDefault()
    let URL_pathname;
    let dataToRender;

    const render = dataToRender => {

      const createTbody = () => {

        let tbody = '<tbody>'
        const entries = Object.entries(dataToRender)

        let rows = entries.reduce( (row,item) => {
          row += `<tr><td>${item[0].slice(0, item[0].indexOf('alle') - 6)}</td><td>${item[1].workedHours}</td><td>${item[1].building}</td><td class="render__description">${item[1].description}</td></tr>`;

          return row;
        }, '' )

        tbody += rows + '</tbody>'

        return tbody;
      }
      
      const totalHours = Object.values(dataToRender).reduce((acc, item) => acc + +item.workedHours, 0 )

      let table = `<table><thead><tr><th>Data</th><th class="render__hours">Ore </th><th class="render__building">Cantiere</th><th>Discrezione</th></tr></thead>`

      table += createTbody();
      
      table += `</tr></tbody><tfoot><tr><th scope="row" colspan="3">Ore totale</th><td class="total__hours">${totalHours}</td></tr></tfoot></table>`

      tempContainer.insertAdjacentHTML('beforeend', table)
    }

    if(inputDate.value !== '') {
      const date = new Date(inputDate.value),
        searchingDate = date.getDate(),
        currentYear = date.getFullYear(),
        currentMonth = date.toLocaleString('it', {month: 'long'} ),
        _queryPath = `orderBy="$key"&startAt="${searchingDate} "&endAt="${searchingDate + 1 } "`

        URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?' + _queryPath + '&auth='; 
    }
    else if(selectMesi.value !== '') { 

      const currentYear = new Date().getFullYear();
      URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + selectMesi.value.toLowerCase() + '.json?auth=';

    } else { 
      document.querySelector('.register-consult__tabs').classList.add('visually-hidden')
      form.classList.add('visually-hidden')
      if (await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} ) ) {
        document.querySelector('.register-consult__tabs').classList.remove('visually-hidden')
      form.classList.remove('visually-hidden')
      } 

      return null
    }

    try{
      const idToken = await authWithEmailAndPassword(userData);
      if(!idToken) throw Error(); 
       
      URL_pathname += idToken;
  
      dataToRender = await getResourceFromDatabase(URL_pathname);
      if(!dataToRender) {
        throw Error();
      }
    }       
    catch (error) {
      // document.getElementById('btnCerca').disabled = false;
      console.log('errore-------', error);
    }
    
    render(dataToRender);
    btnCerca.textContent = 'Nuova ricerca'  
  }

  btnCerca.addEventListener('click', onBtnHandler);
}

export default consultHandle;