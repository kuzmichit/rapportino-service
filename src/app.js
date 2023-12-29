'use strict';

import './css/style.css';
import './css/calendar.css';
import './css/reset.css';
import './css/login.css';
import './css/modal.css';

import header from './img/header_img.jpeg';
// import bindHandler from '../src/modules/bindHandler';

// eslint-disable-next-line no-undef
console.log(process.env.SECRET_KEY);
// import { MainHandler } from './modules/mainHandler.js';
// import { CreateCalendar } from './modules/calendar.js';

// import { calendarsElements } from './modules/support.js';
// const date = new Date();

const submit = document.querySelector('.main__container');
submit.addEventListener('click', () => console.log(submit) );

// let appLocal = new MainHandler(date, calendarsElements);
// MainHandler.test();

// bindHandler();
