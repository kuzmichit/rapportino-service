import { getWidthElem, isMobile } from './support.js';

class navHandler {
  
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

  constructor( { eventStart='pointerdown', eventEnd = 'pointerup', eventMove='pointermove' } ) {
    // Inizializzazione degli eventi
    this.eventMove = eventMove;
    this.eventEnd = eventEnd;
    this.eventStart = eventStart;

    // Binding dei metodi
    this.onNavDown = this.onNavDown.bind(this);
    this.onNavTouch = this.onNavTouch.bind(this); 
    this.onNavUp = this.onNavUp.bind(this);
    this.onNavHourContainerClick = this.onNavHourContainerClick.bind(this);
    this.isAreaNavLeave = this.isNavAreaLeave.bind(this);

    // Assegnazione eventi
    this.listHour.addEventListener(this.eventStart, this.onNavDown);
    this.hourContainer.addEventListener('click', this.onNavHourContainerClick);
  }
  
  onNavDown(e) {
    this.listHourContainerStyleLeft = this.listHourContainer.getBoundingClientRect().left;
    this.leftEdge = this.listHourContainer.offsetWidth - this.listHour.offsetWidth;
    
    const coordX = this.getCoordX(e); 
    this.shiftX = coordX - this.listHour.getBoundingClientRect().left;

    // Aggiungi l'evento di movimento
    this.listHour.addEventListener(this.eventMove, this.onNavTouch); 
    this.calendar.addEventListener(this.eventMove, this.isAreaNavLeave);

    // Aggiungi l'evento di fine trascinamento
    this.listHour.addEventListener(this.eventEnd, this.onNavUp);

    // Impedisce la selezione del testo
    this.listHourContainer.addEventListener('selectstart', function (e) {
      e.preventDefault();
    } );
  }
 
  onNavUp() {
    // Rimuovi gli eventi di movimento e fine trascinamento
    this.listHour.removeEventListener(this.eventMove, this.onNavTouch);
    this.listHour.removeEventListener(this.eventEnd, this.onNavUp);
    this.calendar.removeEventListener(this.eventMove, this.isAreaNavLeave);
    this.listHour.removeEventListener('selectstart', function(e) {
      e.preventDefault();
    } );
  }

  onNavTouch(e) { 
    const coordX = this.getCoordX(e);    
    let newLeft = coordX - this.shiftX - this.listHourContainerStyleLeft;

    // Controllo dei limiti del trascinamento
    if (newLeft > 0) {
      newLeft = 0;
    }
    if (newLeft < this.leftEdge) {
      newLeft = this.leftEdge;
    }

    this.listHour.style.left = newLeft + 'px';
  }
 
  onNavHourContainerClick(e) { // Gestione frecce per spostare le ore
    e.preventDefault();
    this.listHour.style.transition = '0.3s ease-in-out';

    let newLeft;
    const leftEdge = this.listHourContainer.offsetWidth - this.listHour.offsetWidth;

    if (e.target.classList.contains('hour__btn-left') ) {
      newLeft = this.listHour.getBoundingClientRect().left + this.widthHourItem * this.count - this.listHourContainer.getBoundingClientRect().left;
      if (newLeft > 0) newLeft = 0;
    }

    if (e.target.classList.contains('hour__btn-right') ) {
      newLeft = this.listHour.getBoundingClientRect().left - this.widthHourItem * this.count - this.listHourContainer.getBoundingClientRect().left;
      if (newLeft < leftEdge) newLeft = leftEdge;
    }

    this.listHour.style.left = newLeft + 'px';

    setTimeout( () => {
      this.listHour.style.transition = 'none';
    }, 500);
  }
  
  isNavAreaLeave(e) { // Controllo dell'uscita dall'area
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
      this.onNavUp();
      this.calendar.removeEventListener(this.eventMove, this.isAreaNavLeave);
    }
  }

  getCoordX(e) {
    return this.eventStart === 'pointerdown' ? e.clientX : e.touches[0].clientX;
  }

  getCoordY(e) {
    return this.eventStart === 'pointerdown' ? e.clientY : e.touches[0].clientY;
  }
}

const getEventTypes = () => {
  return isMobile() 
    ? { eventStart: 'touchstart', eventEnd: 'touchend', eventMove: 'touchmove' }
    : { }; // Fallback per desktop
};

export const bindNavHourHandler = () => {
  new navHandler(getEventTypes() ); 
};
