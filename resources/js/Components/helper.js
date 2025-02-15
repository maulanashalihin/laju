
/** 
 * Creates a click outside event listener for a DOM node
 * @param {HTMLElement} node - The DOM node to detect clicks outside of
 * @returns {Object} Destroy function to clean up event listener
 */
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

/**
 * Formats and validates a phone number with country code
 * @param {string|number} phone - The phone number to validate
 * @param {string} selected_dial_code - The country dial code (default: "+62")
 * @returns {string} Formatted phone number with country code
 */
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

 

   

/**
 * Generates a random password with a mix of letters, numbers and special characters
 * @param {number} pLength - The desired length of the password
 * @returns {string} Generated password
 */
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


/**
 * Creates a debounced version of a function that delays its execution
 * @param {Function} func - The function to debounce
 * @param {number} timeout - Delay in milliseconds (default: 300)
 * @returns {Function} Debounced function
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}


/**
 * Converts an array of objects to CSV format
 * @param {Array|string} objArray - Array of objects or JSON string to convert
 * @param {string} delimiter - CSV delimiter character (default: ',')
 * @returns {string} CSV formatted string
 */
export function convertToCSV(objArray, delimiter = ',') {
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

/**
 * Displays a toast notification message
 * @param {string} text - The message to display
 * @param {string} type - Toast type: 'success', 'error', 'warning', or 'info' (default: "success")
 * @param {number} duration - How long to show the toast in milliseconds (default: 3000)
 */
export function Toast(text, type = "success", duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        `;
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        min-width: 300px;
        max-width: 90vw;
        margin: 0;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        backdrop-filter: blur(8px);
    `;

    // Define icons for different types with refined styling
    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    // Set background color based on type with refined colors
    switch(type) {
        case 'success':
            toast.style.backgroundColor = 'rgba(34, 197, 94, 0.95)';
            break;
        case 'error':
            toast.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
            break;
        case 'warning':
            toast.style.backgroundColor = 'rgba(245, 158, 11, 0.95)';
            break;
        default:
            toast.style.backgroundColor = 'rgba(59, 130, 246, 0.95)';
            type = 'info';
    }

    // Add icon and text with improved styling
    const iconWrapper = document.createElement('div');
    iconWrapper.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `;
    iconWrapper.innerHTML = icons[type];

    const textWrapper = document.createElement('div');
    textWrapper.style.cssText = `
        flex-grow: 1;
        line-height: 1.4;
    `;
    textWrapper.textContent = text;

    toast.appendChild(iconWrapper);
    toast.appendChild(textWrapper);
    container.appendChild(toast);

    // Enhanced animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0) scale(1)';
    });

    // Remove toast after duration with smooth exit animation
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px) scale(0.95)';
        setTimeout(() => {
            container.removeChild(toast);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 200);
    }, duration);
}
