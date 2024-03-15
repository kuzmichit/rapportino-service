'use strict';

import './css/style.css';
import './css/calendar.css';
import './css/reset.css';
import './css/login.css';
import './css/modal.css';
import './css/consult.css'
import './css/render.css'

// import header from './img/header_img.jpeg';
// import bindHandlerChooseTab from '../src/modules/choose_tab';
// import { MainHandler } from './modules/mainHandler.js';
// import { CreateCalendar } from './modules/calendar.js';
// import { calendarsElements } from './modules/support.js';
// import consultHandle from './modules/consult_handle.js';
// import { bindLogout } from './modules/login.js';
import { bindHandleGoogle } from './modules/firebase/auth_service';

const date = new Date();
// const appLocal = new MainHandler(date, calendarsElements);

// bindHandlerChooseTab();
// consultHandle();
// bindLogout();
bindHandleGoogle();

