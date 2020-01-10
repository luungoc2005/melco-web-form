// import * as wx from 'weixin-js-sdk';

window.setSdkParameter = (name, value) => {
  console.log(`[ setSdkParameter call ] name: {${name}}, value: {${value}}`)
  switch (name) {
    default:
      break;
  }
}

export const getCurrentEnvironment = () => {
  if (window.Android) {
    return 'android';
  }
  else if (window.webkit) {
    return 'ios';
  }
  else if (window.__wxjs_environment === 'miniprogram') {
    return 'miniprogram';
  }
  else {
    return 'web';
  }
}

export const triggers = {
  onDidLoad: () => {
    if (getCurrentEnvironment() === 'android' && window.Android.onDidLoad) {
      window.Android.onDidLoad()
    }
    else if (getCurrentEnvironment() === 'ios' && window.webkit.messageHandlers.onDidLoad) {
      window.webkit.messageHandlers.onDidLoad.postMessage(null)
    }
  }
}

// miniprogram
// if (getCurrentEnvironment() === 'miniprogram') {
//   const headTag = document.getElementsByTagName('head')[0];
//   const scriptTag = document.createElement('script');
//   scriptTag.type = 'text/javascript'
//   scriptTag.src = 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js'

//   // scriptTag.addEventListener('onreadystatechange', callback);
//   // scriptTag.addEventListener('onload', callback);

//   headTag.appendChild(scriptTag);
// }

export const setupMiniprogramSDK = () => {
  const callback = () => {
    if (getCurrentEnvironment() === 'miniprogram') {
      window.close = () => window.wx && window.wx.miniProgram && window.wx.miniProgram.navigateBack({ delta: 1})
  
      console.log('miniprogram SDK loaded')
      // disable links
    
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
      a {
        pointer-events: none;
        color: inherit;
      }
      `;
      document.head.appendChild(styleTag);
    }
  }
  
  if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
    document.addEventListener('WeixinJSBridgeReady', callback, false)
  } 
  else {
    callback()
  
    window.WeixinJSBridge.on('onPageStateChange', function(res) {
      console.log('res is active', res.active)
    })
  }
  // window.open = url => {
  //   window_open(url)
  //   return null as Window;
  // }
  // window.close = () => {
  //   window_close()
  // }
}