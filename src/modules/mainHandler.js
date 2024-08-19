import { camelizeClass, isObject, deleteNodes, getWidthElem } from './support.js';
import { CreateCalendar } from './calendar.js';
import { renderDay } from './renders.js';
import { btnRegisterFormHandler } from './registers_form.js';

export class MainHandler {

  constructor(date, elems) {
    this.elems = elems;
    this.calendar = new CreateCalendar(this.elems.placeToInsert);
    this.currentDate = date;
    this.btnSubmit = document.getElementById('btnSubmit');
    this.elems.targetCurrent.addEventListener('click', this.clickOnHandler.bind(this) );
    this.widthHourItem = getWidthElem('hour');
    this.addSubmit();
    renderDay(date);
    // this.test();
  }
  addSubmit() {
    this.btnSubmit.addEventListener('click', this.handleSubmit.bind(this) );
  }
  clickOnHandler(evt) {
    let action = camelizeClass(evt.target.className).split(' ');
    console.log(action);
    if (!action) return;
    if (!isObject(this[action[0]] ) ) return;
    this[action[0]](evt);
  }

  calendarHeaderText() {
    deleteNodes(this.elems.placeToInsert);
    this.elems.month.classList.toggle('visually-hidden');
    this.elems.buttonLeft.classList.toggle('hidden');
    this.elems.buttonRight.classList.toggle('hidden');

    if (this.elems.month.classList.contains('visually-hidden') ) {
      this.currentDate = new Date();
      renderDay(this.currentDate);
    }
    else renderDay(null, this.currentDate);
    this.calendar(new Date() );
  }

  buttonRight() {
    deleteNodes(this.elems.placeToInsert);
    this.calendar(this.currentDate.setMonth(this.currentDate.getMonth() + 1) );
    renderDay(null, this.currentDate);
  }
  buttonLeft() {
    deleteNodes(this.elems.placeToInsert);
    this.calendar(this.currentDate.setMonth(this.currentDate.getMonth() - 1) );
    renderDay(null, this.currentDate);
  }

  //accerchiamento giorno
  dayItem(evt) {
    evt.preventDefault();
    for (let day of this.elems.placeToInsert.children) {
      if (day.classList.contains('item_checked') ) day.classList.remove('item_checked');
    }
    evt.target.classList.add('item_checked');

    let tmpDate = new Date(+this.currentDate);
    tmpDate.setDate(evt.target.textContent);
    this.currentDate = tmpDate;
  }
  
  editHour() {
    this.elems.listHour.classList.toggle('visually-hidden');
    this.elems.inputHour.classList.toggle('visually-hidden');
    this.elems.hourBtnLeft.classList.toggle('visually-hidden')
    this.elems.hourBtnRight.classList.toggle('visually-hidden')
  }
  //accerchiamento ora
  hour(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('item_checked') ) {
      evt.target.classList.toggle('item_checked');

      return;
    }

    for (let hour of this.elems.listHour.children) {
      if (hour.classList.contains('item_checked') ) hour.classList.remove('item_checked');
    }
    evt.target.classList.add('item_checked');

  }

  //la registrazione della scheda o apertura la finestra Login
  handleSubmit(evt) {
    btnRegisterFormHandler(this.currentDate, evt);
  }
}
