function a(n){const r=i=>{n&&!n.contains(i.target)&&!i.defaultPrevented&&n.dispatchEvent(new CustomEvent("click_outside",n))};return document.addEventListener("click",r,!0),{destroy(){document.removeEventListener("click",r,!0)}}}function c(n){var r="abcdefghijklmnopqrstuvwxyz",i="123456789",t="!@#_",e="",s=Math.ceil(n/2);s=s-1;var l=n-2*s;for(let o=0;o<s;o++)e+=r.charAt(Math.floor(Math.random()*r.length)),e+=i.charAt(Math.floor(Math.random()*i.length));for(let o=0;o<l;o++)e+=t.charAt(Math.floor(Math.random()*t.length));return e=e.split("").sort(function(){return .5-Math.random()}).join(""),e}function d(n,r="success",i=3e3){let t=document.getElementById("toast-container");t||(t=document.createElement("div"),t.id="toast-container",t.style.cssText=`
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        `,document.body.appendChild(t));const e=document.createElement("div");e.style.cssText=`
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
    `;const s={success:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'};switch(r){case"success":e.style.backgroundColor="rgba(34, 197, 94, 0.95)";break;case"error":e.style.backgroundColor="rgba(239, 68, 68, 0.95)";break;case"warning":e.style.backgroundColor="rgba(245, 158, 11, 0.95)";break;default:e.style.backgroundColor="rgba(59, 130, 246, 0.95)",r="info"}const l=document.createElement("div");l.style.cssText=`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `,l.innerHTML=s[r];const o=document.createElement("div");o.style.cssText=`
        flex-grow: 1;
        line-height: 1.4;
    `,o.textContent=n,e.appendChild(l),e.appendChild(o),t.appendChild(e),requestAnimationFrame(()=>{e.style.opacity="1",e.style.transform="translateY(0) scale(1)"}),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(-20px) scale(0.95)",setTimeout(()=>{t.removeChild(e),t.children.length===0&&document.body.removeChild(t)},200)},i)}export{d as T,a as c,c as p};
