'use strict';

import './css/style.css';
import './css/calendar.css';
import './css/reset.css';
import './css/login.css';
import './css/modal.css';
import './css/consult.css'

import header from './img/header_img.jpeg';
import bindHandler from '../src/modules/chooseTab';

import { MainHandler } from './modules/mainHandler.js';
import { CreateCalendar } from './modules/calendar.js';
import { calendarsElements } from './modules/support.js';

const date = new Date();
const appLocal = new MainHandler(date, calendarsElements);

bindHandler();
