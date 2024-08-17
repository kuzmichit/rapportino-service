import { getWidthElem } from './support.js';
export default class moveListHoursOnTouch {

  #hourContainer = document.querySelector('.hour__container');
  #listHourContainer = this.#hourContainer.querySelector('.list__hour-container');
  #listHour = this.#hourContainer.querySelector('.list__hour');
  #btnLeft = this.#hourContainer.querySelector('.hour__btn-left');
  #btnRight = this.#hourContainer.querySelector('.hour__btn-right');
  #shiftX = 0;
  #leftEdge = 0;
  #listHourContainerStyleLeft = 0;
  #widthHourItem = getWidthElem('hour');
  #count = 3;

  constructor() {
    // Lega i metodi solo una volta nel costruttore
    this.onListMove = this.onListMove.bind(this);
    this.onListDown = this.onListDown.bind(this);
    this.onListUp = this.onListUp.bind(this);
    this.onHourContainerClick = this.onHourContainerClick.bind(this)
    // this.onBtnLeftClick = this.onBtnLeftClick.bind(this);
    // this.onBtnRightClick = this.onBtnRightClick.bind(this);

    this.#listHour.addEventListener('pointerdown', this.onListDown);
    this.#hourContainer.addEventListener('click', this.onHourContainerClick);
    // this.#btnRight.addEventListener('click', this.onBtnRightClick);
  }

  onListDown(e) {
    e.preventDefault(); 
    this.#listHourContainerStyleLeft = this.#hourContainer.getBoundingClientRect().left;
    this.#leftEdge = this.#listHourContainer.offsetWidth - this.#listHour.offsetWidth;

    this.#shiftX = e.clientX - this.#listHour.getBoundingClientRect().left;

    // Aggiungi l'evento pointermove quando inizia il trascinamento
    this.#listHour.addEventListener('pointermove', this.onListMove);

    // Aggiungi l'evento pointerup
    this.#listHour.addEventListener('pointerup', this.onListUp);
  }

  onListUp() {
    // Rimuovi gli eventi pointermove e pointerup quando il trascinamento è terminato
    this.#listHour.removeEventListener('pointermove', this.onListMove);
    this.#listHour.removeEventListener('pointerup', this.onListUp);

    console.log('Trascinamento terminato');
  }

  onListMove(e) { // Aggiungi uscita dal campo 
    
    let newLeft = e.clientX - this.#shiftX - this.#listHourContainerStyleLeft;
    // if the pointer is out of slider => adjust left to be within the boundaries
    if (newLeft > 0) {
      newLeft = 0;
    }
      
    if (newLeft < this.#leftEdge) {
      newLeft = this.#leftEdge;
    }

    this.#listHour.style.left = newLeft + 'px';
  }

  onHourContainerClick(e) { //le frecce per spostare le ore
    e.preventDefault();
    this.#listHour.style.transition = '0.5s ease-in-out';

    let newLeft = 0;
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

  onBtnRightClick(e) {
    e.preventDefault();

    const leftEdge = this.#listHourContainer.getBoundingClientRect().width - this.#listHour.getBoundingClientRect().width;
    const listHourStyleLeft = this.#listHour.getBoundingClientRect().left - this.#listHourContainer.getBoundingClientRect().left;

    let newLeft = listHourStyleLeft - this.#widthHourItem * this.#count;
       
    if (newLeft < leftEdge) newLeft = leftEdge 
    
    this.#listHour.style.left = newLeft + 'px';

    setTimeout( () => {
      this.#listHour.style.transition = 'none';
    }, 500);
  }
}