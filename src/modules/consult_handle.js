import { autoClickOnElement, deleteNodes, reduceEntries } from './support.js';
import { renderModalSignIn } from './login.js';
import {asyncConfirm} from './modal.js';
import { getResourceFromDatabase } from './firebase/service.js';

const onBtnCercaHandler = async (e) => {

  const form = document.querySelector('#consulting'),
        btnCerca = form.elements.cerca,
        inputDate = form.elements.date,
        selectMesi = form.elements.mesi,
        userData = JSON.parse(localStorage.getItem('userData') ),
        tempContainer = document.querySelector('.temp__container'),
        consultazioneForm = document.getElementById('consulting'),
        loader = document.querySelector('.loader');

  deleteNodes(tempContainer);
  e.preventDefault();
  let URL_pathname;
  let dataToRender;

  const render = dataToRender => { 
 
    const createTbody = () => {

      let tbody = '<tbody>';
      let entries = Object.entries(dataToRender);
      entries = reduceEntries(entries).sort( (a, b) => a.date > b.date);
 
      let rows = entries.reduce( (row, item) => {
        
        row += `<tr><td>${item.timestamp.slice(0, item.timestamp.indexOf('alle') - 6)}</td><td>${item.workedHours}</td><td>${item.building}</td><td class="render__description">${item.description}</td></tr>`;

        return row;
      }, '');

      tbody += rows + '</tbody>';

      return tbody;
    };
      
    const totalHours = Object.values(dataToRender).reduce( (acc, item) => acc + +item.workedHours, 0);

    let table = '<table><thead><tr><th>Data</th><th class="render__hours">Ore </th><th class="render__building">Cantiere</th><th>Discrezione</th></tr></thead>';

    table += createTbody();
      
    table += `</tr></tbody><tfoot><tr><th scope="row" colspan="3">Ore totale</th><td class="total__hours">${totalHours}</td></tr></tfoot></table>`;

    loader.classList.add('visually-hidden');
    tempContainer.insertAdjacentHTML('beforeend', table);
    tempContainer.classList.remove('visually-hidden')
  };

  try{
    if(inputDate.value !== '') {
      const date = new Date(inputDate.value),
            searchingDate = date.getDate(),
            currentYear = date.getFullYear(),
            currentMonth = date.toLocaleString('it', {month: 'long'} ),
            _queryPath = `orderBy="$key"&startAt="${searchingDate} "&endAt="${searchingDate + 1 } "`;

      URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + currentMonth + '.json?' + _queryPath + '&auth='; 
        
      inputDate.value = '';
    }
    else if(selectMesi.value !== '') { 

      const currentYear = new Date().getFullYear();
      URL_pathname = userData.email.replace('.', '') + '/' + currentYear + '/' + selectMesi.value.toLowerCase() + '.json?auth=';

      selectMesi.value = '';
    }
    else { 
      document.querySelector('.register-consult__tabs').classList.add('visually-hidden');
      form.classList.add('visually-hidden');
      if (await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} ) ) {
        document.querySelector('.register-consult__tabs').classList.remove('visually-hidden');
        form.classList.remove('visually-hidden');
      } 

      return null;
    }
    
    loader.classList.remove('visually-hidden');

    const idToken = await JSON.parse(localStorage.getItem('idToken') );
    if(!idToken) throw Error(); 
    URL_pathname += idToken;
  
    dataToRender = await getResourceFromDatabase(URL_pathname);
    if(dataToRender === undefined || dataToRender === null || Object.keys(dataToRender).length === 0) {
      asyncConfirm( { messageBody: 'La scheda con la data selezionata non presente in database!', messageDate: 'Scegliere un altra data.', no: null } );
      loader.classList.add('visually-hidden');
      
      return null;
    }
  }       
  catch (error) {
    consultazioneForm.classList.add('visually-hidden');
    loader.classList.add('visually-hidden');
    renderModalSignIn();
    console.log('consultHandle +++++', error);

    return null;
  }

  render(dataToRender);
  btnCerca.textContent = 'Nuova ricerca';

  return null;
};

export default onBtnCercaHandler;