(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{129:function(t,e,r){"use strict";var n=r(9);r(30),r(14),r(74),r(75);e.a=function(t,e){e("callApi",function(){var t=Object(n.a)(regeneratorRuntime.mark((function t(e,r,body){var n,o,c,data;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=r||"GET",t.prev=1,t.next=4,fetch(e,{method:r,headers:{"Content-Type":"application/json","Auth-Token":localStorage.getItem("token")},body:JSON.stringify(body)});case 4:if((n=t.sent).ok){t.next=23;break}if(401!=n.status){t.next=11;break}return location.assign("/signin"),t.abrupt("return");case 11:if(403!=n.status){t.next=13;break}throw{message:"Non sei autorizzato ad effettuare questa operazione",status:n.status};case 13:if(!(o=n.headers.get("content-type"))||!o.includes("application/json")){t.next=22;break}return t.next=17,n.json();case 17:throw t.t0=t.sent.errorText,t.t1=n.status,{message:t.t0,status:t.t1};case 22:throw{message:"Si è verificato un errore. (".concat(n.status,")"),status:n.status};case 23:if(!(c=n.headers.get("content-type"))||!c.includes("application/json")){t.next=32;break}return t.next=27,n.json();case 27:return data=t.sent,console.log(r,e,n.status,":",data),t.abrupt("return",{error:!1,data:data});case 32:return console.log(r,e,n.status),t.abrupt("return",{error:!1});case 34:t.next=41;break;case 36:return t.prev=36,t.t2=t.catch(1),console.error(t.t2),alert(t.t2.message),t.abrupt("return",{error:!0,errorStatus:t.t2.status});case 41:case"end":return t.stop()}}),t,null,[[1,36]])})));return function(e,r,n){return t.apply(this,arguments)}}()),e("uploadFile",function(){var t=Object(n.a)(regeneratorRuntime.mark((function t(e,body){var r,n,o,data;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch(e,{method:"POST",headers:{"Auth-Token":localStorage.getItem("token")},body:body});case 3:if((r=t.sent).ok){t.next=22;break}if(401!=r.status){t.next=10;break}return location.assign("/signin"),t.abrupt("return");case 10:if(403!=r.status){t.next=12;break}throw{message:"Non sei autorizzato ad effettuare questa operazione",status:r.status};case 12:if(!(n=r.headers.get("content-type"))||!n.includes("application/json")){t.next=21;break}return t.next=16,r.json();case 16:throw t.t0=t.sent.errorText,t.t1=r.status,{message:t.t0,status:t.t1};case 21:throw{message:"Si è verificato un errore. (".concat(r.status,")"),status:r.status};case 22:if(!(o=r.headers.get("content-type"))||!o.includes("application/json")){t.next=31;break}return t.next=26,r.json();case 26:return data=t.sent,console.log("POST",e,r.status,":",data),t.abrupt("return",{error:!1,data:data});case 31:return console.log("POST",e,r.status),t.abrupt("return",{error:!1});case 33:t.next=40;break;case 35:return t.prev=35,t.t2=t.catch(0),console.error(t.t2),alert(t.t2.message),t.abrupt("return",{error:!0,errorStatus:t.t2.status});case 40:case"end":return t.stop()}}),t,null,[[0,35]])})));return function(e,r){return t.apply(this,arguments)}}()),e("formatDate",(function(t){try{var e=new Date(t).toLocaleString("it-IT",{dateStyle:"long"});return e="Invalid Date"==e?"":e}catch(t){return""}}))}},192:function(t,e,r){r(193),t.exports=r(194)}},[[192,27,2,28]]]);