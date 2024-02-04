import { camelizeClass, isObject, deleteNodes, isUserDataInLocalStorage} from './support.js';
import { CreateCalendar } from './calendar.js';
import { renderDay} from './renders.js';
import { renderModalSignIn } from './login';
import {btnRegisterFormHandler} from './registers_form.js';

export class MainHandler {
  
  constructor(date, elems) {
    this.elems = elems;
    this.calendar = new CreateCalendar(this.elems.placeToInsert);
    this.currentDate = date;
    this.btnSubmit = document.getElementById('btnSubmit');
    this.elems.targetCurrent.addEventListener('pointerdown', this.clickOnHandler.bind(this) );
    this.addSubmit();
    renderDay(date);
    // this.test();
  }
  addSubmit() {
    this.btnSubmit.addEventListener('pointerdown', this.handleSubmit.bind(this) );
  }
  clickOnHandler(evt) {
    let action = camelizeClass(evt.target.className).split(' ');
    if (!action) return;
    if(!isObject(this[action[0]] ) ) return;
    this[action[0]](evt);
    // console.log(action);
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
  //le frecce per spostare le ore
  hourBtnLeft(e) {
    e.preventDefault();
    if(this.elems.listHour.getBoundingClientRect().left <= 0 && this.elems.listHour.getBoundingClientRect().left + 150 <= 0) {
      this.elems.listHour.style.left = this.elems.listHour.getBoundingClientRect().left + 150 + 'px';
    }
    else(this.elems.listHour.style.left = 0 + 'px');
  }

  hourBtnRight(e) {
    e.preventDefault();
    const leftMax = this.elems.listHourContainer.getBoundingClientRect().width - this.elems.listHour.getBoundingClientRect().width;
    const listHourStyleLeft = this.elems.listHour.getBoundingClientRect().left - this.elems.listHourContainer.getBoundingClientRect().left;
    if(listHourStyleLeft >= leftMax && listHourStyleLeft - 150 >= leftMax) { 
      this.elems.listHour.style.left = listHourStyleLeft - 150 + 'px';
      console.log(true);
    } 
    else(this.elems.listHour.style.left = leftMax + 'px');
    console.log(leftMax, listHourStyleLeft);
  }
  //accerchiamento giorno
  dayItem(evt) {
    evt.preventDefault();
    for (let day of this.elems.placeToInsert.children) {
      if(day.classList.contains('item_checked') ) day.classList.remove('item_checked');
    }
    evt.target.classList.add('item_checked');
    
    let tmpDate = new Date(+this.currentDate);
    tmpDate.setDate(evt.target.textContent);
    this.currentDate = tmpDate; 
  }
  //accerchiamento ora
  hour(evt) {
    evt.preventDefault();
    if(evt.target.classList.contains('item_checked') ) {
      evt.target.classList.toggle('item_checked');
      
      return;
    }
    //let hourChecked = evt.target;
    for (let hour of this.elems.listHour.children) {
      if(hour.classList.contains('item_checked') ) hour.classList.remove('item_checked');
    }
    evt.target.classList.add('item_checked');

  }

  //la registrazione della scheda o apertura la finestra Login
  handleSubmit(evt) {
    this.btnSubmit.style.display = 'none';
    btnRegisterFormHandler(this.currentDate, evt);
  }
  static test() {

    const autoClickOnElement = element => {
      window.addEventListener('DOMContentLoaded', click);
    
      function click() { 
        const clickEvent = new Event('pointerdown');
        
        document.querySelector('.submit__button').dispatchEvent(clickEvent);
      } 
    };
    autoClickOnElement();
    console.log('autoClickOnSubmit');
  }
}
