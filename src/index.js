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

  if (_messengerExtensions) {
    _messengerExtensions.getSupportedFeatures(function success(result) {
      let features = result.supported_features;
      if (features.indexOf("context") != -1) {
        _messengerExtensions.getContext('2417495391665520',
          function success(thread_context) {
            document.getElementById("psid").value = thread_context.psid;
          },
          function error(err) {
            console.log(err);
          }
        );
      }
    }, function error(err) {
      console.log(err);
    });
  }
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
