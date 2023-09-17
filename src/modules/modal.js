//Custom Confirm Class
/**
 * @param Object {title,Message,yes,no,yesCallback,noCallback}
 *  this.title:"Test Confirm Window",
 *  this.yesCallback = resolve(true) || function() {};
 */
const btnSubmit = document.getElementById('btnSubmit');
class ConfirmBox {
  constructor( {
    title, messageBody, messageWorkedHour, yes, no, onBtnYes, onBtnNo, remove 
  }, onClick) {
    this.title = title || 'Errore';
    this.messageBody = messageBody || 'La scheda  non è stata registrata';
    this.messageWorkedHour = messageWorkedHour || null;
    this.yes = yes || 'Ok';
    this.no = no || 'No';
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

    let modalMessageDate = document.createElement('p');
    modalMessageDate.classList.add('confirm-modal-message');
    modalMessageDate.textContent = this.messageBody;
      
    let modalMessageWorkedHour = document.createElement('p');
    modalMessageWorkedHour.classList.add('confirm-modal-message');
    modalMessageWorkedHour.textContent = this.messageWorkedHour;

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
   
    modalBody.appendChild(modalMessageDate);
    modalBody.appendChild(modalMessageWorkedHour);
    modalBody.appendChild(modalFooter);
    modalFooter.appendChild(modalYes);
    modalFooter.appendChild(modalNo);
    // Append Modal to Body
    document.body.appendChild(modal);

    // Append Event Listener to Close Button like BIND
    this.modalYes = modalYes;
    this.modalNo = modalNo;
    this.modal = modal;
    this.remove(this.modalNo);
  }

  // Event And Callback Handler
  eventHandler() {
    // Append Event Listener to Yes Button
    this.modalYes.addEventListener('click', () => {
      this.onBtnYes(true);
      btnSubmit.disabled = false;
      this.modal.remove();
    } );

    this.modalNo.addEventListener('click', () => {
      this.onBtnNo(false);
      this.modal.remove();
      document.getElementById('btnSubmit').disabled=false;
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
