//Custom Confirm Class
/**
 * @param Object {title,Message,yes,no,yesCallback,noCallback}
 *  this.title:"Test Confirm Window",
 *  this.yesCallback = resolve(true) || function() {};
 * 
 * Per rendere messaggio senza aspettare 
 * @esempio await asyncConfirm( {messageBody: 'Scegli la data o il mese!', no: null} )
 * 
 * Con la condizione usure il @confirmBox
 */
class ConfirmBox {
  #btnSubmit= document.getElementById('btnSubmit');
  #containerStyle = document.querySelector('.wrapper');
  #bodyStyle = document.body;

  #closeModal() {
    if(this.#btnSubmit) this.#btnSubmit.disabled = false; // sistemare in loginForm
    this.#containerStyle.style = 'filter: blur(0)';
    this.#bodyStyle.style = 'overflow: visible';
    this.modal.remove();
  }
  
  constructor( { title, messageBody, messageWorkedHour, messageDate, yes, no, onBtnYes, onBtnNo, remove 
  }, onClick) {
    this.title = title || 'Errore';
    this.messageBody = messageBody || 'La scheda  non è stata registrata';
    this.messageDate = messageDate || null;
    this.messageWorkedHour = messageWorkedHour || null;
    this.yes = yes || 'Ok';
    this.no = (no !== null) && 'No';
    this.remove = remove || function () {};
    this.onBtnYes = onClick || function () {};
    this.onBtnNo = onClick || function () {};
    this.Ui();
    this.eventHandler();
  }

  Ui() {
    // Create Element
    let modal = document.createElement('div');
    modal.classList.add('confirm-modal');

    let modalBody = document.createElement('div');
    modalBody.classList.add('confirm-modal-body');

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('confirm-modal-header');

    let modalTitle = document.createElement('div');
    modalTitle.classList.add('confirm-modal-title');
    modalTitle.innerHTML = this.title;

    let modalmessageBody = document.createElement('p');
    modalmessageBody.classList.add('confirm-modal-message');
    modalmessageBody.textContent = this.messageBody;
      
    let modalMessageWorkedHour = document.createElement('p');
    modalMessageWorkedHour.classList.add('confirm-modal-message');
    modalMessageWorkedHour.textContent = this.messageWorkedHour;
    
    let modalMessageDate = document.createElement('p');
    modalMessageDate.classList.add('confirm-modal-message');
    modalMessageDate.textContent = this.messageDate;

    let modalFooter = document.createElement('div');
    modalFooter.classList.add('confirm-modal-footer');

    let modalYes = document.createElement('div');
    modalYes.classList.add('confirm-modal-yes');
    modalYes.innerHTML = this.yes;

    let modalNo = document.createElement('div');
    modalNo.classList.add('confirm-modal-no');
    modalNo.innerHTML = this.no;

    // Append Element to Modal
    modal.appendChild(modalBody);
    modalBody.appendChild(modalHeader);
    modalHeader.appendChild(modalTitle);
   
    modalBody.appendChild(modalmessageBody);
    modalBody.appendChild(modalMessageWorkedHour);
    modalBody.appendChild(modalMessageDate);
    modalBody.appendChild(modalFooter);
    modalFooter.appendChild(modalYes);
    if(this.no) modalFooter.appendChild(modalNo);
    // Append Modal to Body
    document.body.appendChild(modal);
    this.#containerStyle.style = 'filter: blur(10px)';
    this.#bodyStyle.style = 'overflow: hidden';

    // Append Event Listener to Close Button like BIND
    this.modalYes = modalYes;
    this.modalNo = modalNo ;
    this.modal = modal;
    this.remove(this.modalNo);
  }

  // Event And Callback Handler
  eventHandler() {
    // Append Event Listener to Yes Button
    this.modalYes.addEventListener('click', () => {
      this.onBtnYes(true);
      this.#closeModal();  
    } );

    this.modalNo.addEventListener('click', () => {
      this.onBtnNo(false);
      this.#closeModal();
    } );
  }

}

const asyncConfirm = (option) => new Promise(resolve => {
  
  const onClick = (val) => {
    resolve(val);
  };
  new ConfirmBox(option, onClick);
} ); 

export {asyncConfirm, ConfirmBox};
