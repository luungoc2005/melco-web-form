import React from 'react';
import ReactDOM from 'react-dom'
import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

export let _messengerExtensions = null;

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
      return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

window.extAsyncInit = function () {
  ReactDOM.render(<App />, document.getElementById('root'));
  _messengerExtensions = window.MessengerExtensions
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
