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
    // tipi di evento
    this.eventMove = eventMove;
    this.eventEnd = eventEnd;
    this.eventStart = eventStart;
    // Lega i metodi solo una volta nel costruttore
    this.onListMove = this.onListMove.bind(this);
    this.onListDown = this.onListDown.bind(this);
    this.onListTouch = this.onListTouch.bind(this);
    this.onListUp = this.onListUp.bind(this);
    this.onHourContainerClick = this.onHourContainerClick.bind(this)

    this.listHour.addEventListener(eventStart, this.onListDown);
    this.hourContainer.addEventListener('click', this.onHourContainerClick);
    this.isAreaListLeave = this.isAreaListLeave.bind(this)
  }

  onListDown(e) {
    e.preventDefault();
    this.listHourContainerStyleLeft = this.hourContainer.getBoundingClientRect().left;
    this.leftEdge = this.listHourContainer.offsetWidth - this.listHour.offsetWidth;

    let coordX = this.eventStart === 'pointerdown' ? e.clientX : e.touches[0].clientX 
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

    let coordX = (e.type =  )
    
    let newLeft = e.clientX - this.shiftX - this.listHourContainerStyleLeft;
    // if the pointer is out of slider => adjust left to be within the boundaries
    if (newLeft > 0) {
      newLeft = 0;
    }
      
    if (newLeft < this.#leftEdge) {
      newLeft = this.#leftEdge;
    }
    
    this.isAreaListLeave(e);
    
    this.#listHour.style.left = newLeft + 'px';
  }

  onHourContainerClick(e) { //le frecce per spostare le ore
    e.preventDefault();
    this.#listHour.style.transition = '0.5s ease-in-out';

    let newLeft;
    const shiftLeftListHour = this.#listHour.getBoundingClientRect().left - this.#listHourContainer.getBoundingClientRect().left;
    const leftEdge = this.#listHourContainer.getBoundingClientRect().width - this.#listHour.getBoundingClientRect().width;

    if (e.target.classList.contains('hour__btn-left') ) {
      newLeft = shiftLeftListHour + this.#widthHourItem * this.#count;
      if (newLeft > 0) newLeft = 0;
    }

    if (e.target.classList.contains('hour__btn-right') ) {
      newLeft = shiftLeftListHour - this.#widthHourItem * this.#count;
       
      if (newLeft < leftEdge) newLeft = leftEdge;
    }

    this.#listHour.style.left = newLeft + 'px';

    setTimeout( () => {
      this.#listHour.style.transition = 'none';
    }, 500);
  }
  
  isAreaListLeave(e) { // uscita dal campo list hour
    e.preventDefault();
    const containerRect = this.#listHourContainer.getBoundingClientRect();
    
    if (
      e.clientX < containerRect.left ||
      e.clientX > containerRect.right ||
      e.clientY < containerRect.top ||
      e.clientY > containerRect.bottom
    ) {
      this.onListUp();
      this.#calendar.removeEventListener('pointermove', this.isAreaListLeave);
    }
  }

  onListTouch(e) {
    console.log(e.touches[0].clientX);
    function isMobile() {
      const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      return regex.test(navigator.userAgent);
    }
    
    if (isMobile() ) {
      console.log('Mobile device detected');
    }
    else {
      console.log('Desktop device detected');
    }
  }
}
}