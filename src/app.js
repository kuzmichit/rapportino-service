'use strict';

import './css/style.css';
import './css/calendar.css';
import './css/reset.css';
import './css/login.css';
import './css/modal.css';
import './css/consult.css';
import './css/render.css';

import header from './img/header_img.jpeg';
import bindHandlerChooseTab from '../src/modules/choose_tab';
import { MainHandler } from './modules/mainHandler.js';
import { calendarsElements, deleteCookie } from './modules/support.js';
import { bindLogout } from './modules/login.js';

const date = new Date();
new MainHandler(date, calendarsElements);

deleteCookie('g_state') // da controllare
bindHandlerChooseTab();
bindLogout();