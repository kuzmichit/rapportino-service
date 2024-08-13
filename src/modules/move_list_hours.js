const calendar = document.getElementById('calendar');

export default class moveListHoursOnTouch {

  #listHour = document.querySelector('.list__hour');
  #listHourContainer = calendar.querySelector('.list__hour-container');
  #shiftX = null;

  constructor() {
    // Lega i metodi solo una volta nel costruttore
    this.moveListHours = this.moveListHours.bind(this);
    this.onListDown = this.onListDown.bind(this);
    this.onListUp = this.onListUp.bind(this);
    this.onThumbMove = this.onThumbMove.bind(this);

    this.#listHour.addEventListener('pointerdown', this.onListDown);
}

onListDown(e) {
  e.preventDefault(); // Impedisce la selezione del testo (azione del browser)
  console.log('onListDown');
    this.#shiftX = e.clientX - this.#listHour.getBoundingClientRect().left;

    // Aggiungi l'evento pointermove quando inizia il trascinamento
    this.#listHour.addEventListener('pointermove', this.onThumbMove);

    // Aggiungi l'evento pointerup
    this.#listHour.addEventListener('pointerup', this.onListUp);
}

  onListUp(e) {
    // Rimuovi gli eventi pointermove e pointerup quando il trascinamento è terminato
    this.#listHour.removeEventListener('pointermove', this.onThumbMove);
    this.#listHour.removeEventListener('pointerup', this.onListUp);

    console.log('Trascinamento terminato');
}

  moveListHours(e) {
  this.#shiftX -= e.clientX
//   const listHourStyleLeft = this.#listHour.getBoundingClientRect().left,
//         maxLeft = this.#listHourContainer.getBoundingClientRect().left

//   if (listHourStyleLeft < maxLeft) {
//   let newLeft = listHourStyleLeft - maxLeft + this.#shiftX
//   if (newLeft > 0) {
//     newLeft = 0;
//   }
//   this.#listHour.style.left = newLeft + 'px';
// }

  console.log(this.#shiftX);
  this.#shiftX = 0
  }
  
    onThumbMove(e) {
    let newLeft = e.clientX - this.#shiftX - this.#listHourContainer.getBoundingClientRect().left;
 
    // if the pointer is out of slider => adjust left to be within the boundaries
    if (newLeft > 0) {
      newLeft = 0;
      }
    
    const listHourStyleLeft = this.#listHour.getBoundingClientRect().left,
        maxLeft = this.#listHourContainer.getBoundingClientRect().left
      
    let rightEdge = listHourStyleLeft - maxLeft + e.clientX;
    // let rightEdge = this.#listHourContainer. - this.#listHour.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

      this.#listHour.style.left = newLeft + 'px';
      console.log(newLeft,'NEWLEFT', 'SHIFT');
      this.#shiftX = 0

  };
}