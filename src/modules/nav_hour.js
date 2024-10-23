import { getWidthElem, isMobile } from './support.js';

class navHourHandler {
  
  calendar = document.getElementById('calendar');
  hourContainer = document.querySelector('.hour__container');
  listHourContainer = this.hourContainer.querySelector('.list__hour-container');
  listHour = this.hourContainer.querySelector('.list__hour');
  shiftX = 0;
  leftEdge = 0;
  listHourContainerStyleLeft = 0;
  marginListHourItem = 16;
  widthHourItem = getWidthElem('hour') + 2 * this.marginListHourItem;
  count = 3;

  constructor( {eventStart='pointerdown', eventEnd = 'pointerup', eventMove='pointermove' } ) {
    // iniziazione di eventi
    this.eventMove = eventMove;
    this.eventEnd = eventEnd;
    this.eventStart = eventStart;
    // Legamento i metodi solo una volta nel costruttore
    this.onNavHourDown= this.onNavHourDown.bind(this);
    this.onNavHourTouch = this.onNavHourTouch.bind(this);
    this.onNavHourUp = this.onNavHourUp.bind(this);
    this.onNavHourContainerClick = this.onNavHourContainerClick.bind(this)
    this.isNavHourAreaLeave = this.isNavHourAreaLeave.bind(this);

    this.listHour.addEventListener(this.eventStart, this.onNavHourDown);
    this.hourContainer.addEventListener('click', this.onNavHourContainerClick);
  }
  
  onNavHourDown(e) {
    this.listHourContainerStyleLeft = this.hourContainer.getBoundingClientRect().left;
    this.leftEdge = this.listHourContainer.offsetWidth - this.listHour.offsetWidth;
    
    const coordX = this.getCoordX(e); 
    this.shiftX = coordX - this.listHour.getBoundingClientRect().left;

    // Aggiungi l'evento pointermove quando inizia il trascinamento
    this.listHour.addEventListener(this.eventMove, this.onNavHourTouch);
    this.calendar.addEventListener(this.eventMove, this.isNavHourAreaLeave);

    // Aggiungi l'evento pointerup
    this.listHour.addEventListener(this.eventEnd, this.onNavHourUp);
  }
 
  onNavHourUp() {
    // Rimuovi gli eventi pointermove e pointerup quando il trascinamento è terminato
    this.listHour.removeEventListener(this.eventMove, this.onNavHourTouch);
    this.listHour.removeEventListener(this.eventEnd, this.onNavHourUp);
    this.calendar.removeEventListener(this.eventMove, this.isNavHourAreaLeave);
  }

  onNavHourTouch(e) { 
    console.log(55555);
    const coordX = this.getCoordX(e)    
    let newLeft = coordX - this.shiftX - this.listHourStyleLeft;

    // if the pointer is out of slider => adjust left to be within the boundaries
    if (newLeft > 0) {
      newLeft = 0;
    }
      
    if (newLeft < this.leftEdge) {
      newLeft = this.leftEdge;
    }
    
    this.isNavHourAreaLeave(e);
    
    this.listHour.style.left = newLeft + 'px';
  }
 
  onNavHourContainerClick(e) { //le frecce per spostare le ore
    e.preventDefault();
    this.listHour.style.transition = '0.3s ease-in-out';

    let newLeft;
    const shiftLeftListHour = this.listHour.getBoundingClientRect().left - this.hourContainer.getBoundingClientRect().left;
    const leftEdge = this.listHourContainer.getBoundingClientRect().width - this.listHour.getBoundingClientRect().width;
    const leftBounderListHourContainer = this.listHourContainer.getBoundingClientRect().left
    
    if (e.target.classList.contains('hour__btn-left') ) {
      newLeft = this.listHour.getBoundingClientRect().left + this.widthHourItem * this.count - this.listHourContainer.getBoundingClientRect().left; 
      if (newLeft > 0) newLeft = 0;
    }

    if (e.target.classList.contains('hour__btn-right') ) {
      
      newLeft = this.listHour.getBoundingClientRect().left - this.widthHourItem * this.count - this.listHourContainer.getBoundingClientRect().left;
      
      ( () => console.log(this.listHour.getBoundingClientRect().left, 'listEnd') )()
      //, shiftLeftListHour, 'shiftLeftListHour', this.widthHourItem * this.count, 'this.widthHourItem * this.count');
       
      if (newLeft < leftEdge) newLeft = leftEdge;
    }

    this.listHour.style.left = newLeft + 'px';

    setTimeout( () => {
      this.listHour.style.transition = 'none';
    }, 500);
  }
  
  isNavHourAreaLeave(e) { // uscita dal campo list hour
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
      this.onNavHourUp();
      this.calendar.removeEventListener(this.eventMove, this.isNavHourAreaLeave);
    }
  }

  getCoordX(e) {
    return this.eventStart === 'pointerdown' ? e.clientX : e.touches[0].clientX
  }

  getCoordY(e) {
    return this.eventStart === 'pointerdown' ? e.clientY : e.touches[0].clientY
  }
}

const getEventTypes = () => {
  return isMobile() 
    ? { eventStart: 'touchstart', eventEnd: 'touchend', eventMove: 'touchmove' } 
    : { };
};

export const bindNavHourHandler = () => {
  new navHourHandler( {} )
}
