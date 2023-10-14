import dayjs from "dayjs"; 
import relativeTime from 'dayjs/plugin/relativeTime';
import Toastify from "toastify-js";
dayjs.extend(relativeTime)
/** Dispatch event on click outside of node */
export function clickOutside(node) {
  
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(
          new CustomEvent('click_outside', node)
        )
      }
    }
  
      document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
      }
  }

  export function validatePhone(phone, selected_dial_code = "+62") {
 
    
    var number = phone.toString().split('-').join(' ').split(' ').join('');
    if (number[0] == '0') {
    number = number.replace('0', '')
    }

    if (number.includes(selected_dial_code)) {
    number = number.replace(selected_dial_code, '')
    }

    if (number.substring(0, selected_dial_code.length - 1) == selected_dial_code.replace("+",
        '')) {
    number = number.replace(selected_dial_code.replace("+", ''), '')
    }

    number = selected_dial_code.replace("+", '') + number;


    return number;


    }

    export function getTimeISO(t){
      return dayjs(t).fromNow() 
  }
  
 


export function password_generator( pLength ) {
  var keyListAlpha="abcdefghijklmnopqrstuvwxyz",
  keyListInt="123456789",
  keyListSpec="!@#_",
  password='';
var len = Math.ceil(pLength/2);
len = len - 1;
var lenSpec = pLength-2*len;

for (let i=0;i<len;i++) {
  password+=keyListAlpha.charAt(Math.floor(Math.random()*keyListAlpha.length));
  password+=keyListInt.charAt(Math.floor(Math.random()*keyListInt.length));
}

for (let i=0;i<lenSpec;i++)
  password+=keyListSpec.charAt(Math.floor(Math.random()*keyListSpec.length));

password=password.split('').sort(function(){return 0.5-Math.random()}).join('');

return password;
}


export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}


export function convertToCSV(objArray,delimiter = ',') {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += delimiter

          line += array[i][index];
      }

      str += line + '\r\n';
  }

  return str;
}
export function Toast(text, type = "success", duration = 3000) {
     if(type == "success")
     {
        Toastify({
          text: text,
          style: {
              background:
                  "linear-gradient(to right, #06b6d4, #2dd4bf)",
          },
      }).showToast();
     }

     if(type == "error")
     {
        Toastify({
          text: text,
          style: {
              background:
                  "linear-gradient(to right, #b91c1c, #ef4444)",
          },
      }).showToast();
     }

}