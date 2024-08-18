import { getWidthElem } from './support.js';

export default class moveList {

  calendar = document.getElementById('calendar');
  hourContainer = document.querySelector('.hour__container');
  listHourContainer = this.hourContainer.querySelector('.list__hour-container');
  listHour = this.hourContainer.querySelector('.list__hour');
  shiftX = 0;
  leftEdge = 0;
  listHourContainerStyleLeft = 0;
  widthHourItem = getWidthElem('hour');
  count = 3;

  constructor( {eventStart='pointerdown', eventEnd = 'pointerup', eventMove='pointermove' } ) {
    // iniziazione di eventi
    this.eventMove = eventMove;
    this.eventEnd = eventEnd;
    this.eventStart = eventStart;
    // Lega i metodi solo una volta nel costruttore
    this.onListDown = this.onListDown.bind(this);
    this.onListMove = this.onListMove.bind(this);
    this.onListUp = this.onListUp.bind(this);
    this.onHourContainerClick = this.onHourContainerClick.bind(this)
    this.isAreaListLeave = this.isAreaListLeave.bind(this);

    this.listHour.addEventListener(eventStart, this.onListDown);
    this.hourContainer.addEventListener('click', this.onHourContainerClick);
  }
  
  onListDown(e) {
    e.preventDefault();
    this.listHourContainerStyleLeft = this.hourContainer.getBoundingClientRect().left;
    this.leftEdge = this.listHourContainer.offsetWidth - this.listHour.offsetWidth;
    
    const coordX = this.getCoordX(e); 
    this.shiftX = coordX - this.listHour.getBoundingClientRect().left;

    // Aggiungi l'evento pointermove quando inizia il trascinamento
    this.listHour.addEventListener(this.eventMove, this.onListMove);
    this.calendar.addEventListener(this.eventMove, this.isAreaListLeave);

    // Aggiungi l'evento pointerup
    this.listHour.addEventListener(this.eventEnd, this.onListUp);
  }
 
  onListUp() {
    // Rimuovi gli eventi pointermove e pointerup quando il trascinamento è terminato
    this.listHour.removeEventListener(this.eventMove, this.onListMove);
    this.listHour.removeEventListener(this.eventEnd, this.onListUp);
    this.calendar.removeEventListener(this.eventMove, this.isAreaListLeave);
  }

  onListMove(e) { 
    const coordX = this.getCoordX(e)    
    let newLeft = coordX - this.shiftX - this.listHourContainerStyleLeft;

    // if the pointer is out of slider => adjust left to be within the boundaries
    if (newLeft > 0) {
      newLeft = 0;
    }
      
    if (newLeft < this.leftEdge) {
      newLeft = this.leftEdge;
    }
    
    this.isAreaListLeave(e);
    
    this.listHour.style.left = newLeft + 'px';
  }
 
  onHourContainerClick(e) { //le frecce per spostare le ore
    e.preventDefault();
    this.listHour.style.transition = '0.5s ease-in-out';

    let newLeft;
    const shiftLeftListHour = this.listHour.getBoundingClientRect().left - this.listHourContainer.getBoundingClientRect().left;
    const leftEdge = this.listHourContainer.getBoundingClientRect().width - this.listHour.getBoundingClientRect().width;

    if (e.target.classList.contains('hour__btn-left') ) {
      newLeft = shiftLeftListHour + this.widthHourItem * this.count;
      if (newLeft > 0) newLeft = 0;
    }

    if (e.target.classList.contains('hour__btn-right') ) {
      newLeft = shiftLeftListHour - this.widthHourItem * this.count;
       
      if (newLeft < leftEdge) newLeft = leftEdge;
    }

    this.listHour.style.left = newLeft + 'px';

    setTimeout( () => {
      this.listHour.style.transition = 'none';
    }, 500);
  }
  
  isAreaListLeave(e) { // uscita dal campo list hour
    e.preventDefault();
    const containerRect = this.listHourContainer.getBoundingClientRect();
    const coordX = this.getCoordX(e);
    const coordY = this.getCoordY(e);
    
    if (
      coordX < containerRect.left ||
      coordX > containerRect.right ||
      coordY < containerRect.top ||
      coordY > containerRect.bottom
    ) {
      this.onListUp();
      this.calendar.removeEventListener(this.eventMove, this.isAreaListLeave);
    }
  }

  getCoordX(e) {
    return this.eventStart === 'pointerdown' ? e.clientX : e.touches[0].clientX
  }

  getCoordY(e) {
    return this.eventStart === 'pointerdown' ? e.clientY : e.touches[0].clientY
  }
}