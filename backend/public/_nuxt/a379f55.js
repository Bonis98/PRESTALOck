(window.webpackJsonp=window.webpackJsonp||[]).push([[15,2,3,4,6,8],{258:function(e,t,n){"use strict";n.r(t);var r={props:{text:{type:String,default:function(){return""}}}},o=n(44),component=Object(o.a)(r,(function(){var e=this;return(0,e._self._c)("button",{staticClass:"bg-blue-400 rounded-full px-7 py-3 hover:bg-blue-500",on:{click:function(t){return e.$emit("click")}}},[e._v("\n  "+e._s(e.text)+"\n")])}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{Button:n(258).default})},259:function(e,t,n){"use strict";n.r(t);n(37);var r={props:{backRedirect:{type:String,default:function(){return""}}},data:function(){return{name:localStorage.getItem("name")}},methods:{logout:function(){confirm("Sei sicuro di voler uscire?")&&this.$router.push({path:"/login"})}}},o=n(44),component=Object(o.a)(r,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"h-10 w-screen items-center bg-blue-500 flex flex-row gap-3 fixed px-4 text-white"},[e.backRedirect?t("NuxtLink",{staticClass:"h-2/4 cursor-pointer",attrs:{to:{path:e.backRedirect}}},[t("img",{staticClass:"h-full",attrs:{src:"/icons/back.png"}})]):e._e(),e._v(" "),t("div",{staticClass:"flex-grow"}),e._v(" "),t("div",[e._v(" "+e._s(e.name)+" ")]),e._v(" "),e.name&&e.name.length>0?t("div",{staticClass:"h-2/4 cursor-pointer"},[t("img",{staticClass:"h-full",attrs:{src:"/icons/logout.png"},on:{click:function(t){return e.logout()}}})]):e._e()],1)}),[],!1,null,null,null);t.default=component.exports},260:function(e,t,n){"use strict";n.r(t);var r={props:{value:{type:String,default:function(){return""}},type:{type:String,default:function(){return""}}}},o=n(44),component=Object(o.a)(r,(function(){var e=this;return(0,e._self._c)("input",{staticClass:"w-72 border border-blue-400 rounded-full px-5 py-2",attrs:{type:e.type?e.type:"text"},domProps:{value:e.value},on:{input:function(t){return e.$emit("input",t.target.value)}}})}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{Input:n(260).default})},261:function(e,t,n){"use strict";n.r(t);var r=n(44),component=Object(r.a)({},(function(){return(0,this._self._c)("div",{staticClass:"bg-black bg-opacity-70 w-screen h-screen fixed z-50"})}),[],!1,null,null,null);t.default=component.exports},262:function(e,t,n){"use strict";n.r(t);n(37);var r={props:{value:{type:String,default:function(){return""}},options:{type:Array,default:function(){return[]}}}},o=n(44),component=Object(o.a)(r,(function(){var e=this,t=e._self._c;return t("select",{staticClass:"w-52 border border-blue-400 rounded-full px-5 py-2",domProps:{value:e.value},on:{input:function(t){return e.$emit("input",t.target.value)}}},[t("option",{attrs:{selected:"",value:"",disabled:""}},[e._v("\n    Seleziona\n  ")]),e._v(" "),e._l(e.options,(function(n){return t("option",{key:n.val,domProps:{value:n.val}},[e._v("\n    "+e._s(n.name)+"\n  ")])}))],2)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{Select:n(262).default})},273:function(e,t,n){"use strict";n.r(t);n(37),n(46),n(47),n(26),n(25),n(30),n(45),n(48),n(27);var r=n(9);n(31),n(14),n(76);function o(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,d=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return c=e.done,e},e:function(e){d=!0,o=e},f:function(){try{c||null==n.return||n.return()}finally{if(d)throw o}}}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var c={data:function(){return{loading:!0,email:"",password:"",confirmPassword:"",name:"",surname:"",dateOfBirth:"",province:"",gender:"*",allProvinces:[]}},watch:{loading:function(e){var t,n=o(document.querySelectorAll("Input, Button, Select"));try{for(n.s();!(t=n.n()).done;){t.value.disabled=e}}catch(e){n.e(e)}finally{n.f()}}},created:function(){localStorage.removeItem("token"),localStorage.removeItem("name")},mounted:function(){this.getProvinces()},methods:{getProvinces:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,new Promise((function(e){return setTimeout(e,1e3)}));case 2:e.allProvinces=[{val:"Milano",name:"Milano"},{val:"Cremona",name:"Cremona"},{val:"Bergamo",name:"Bergamo"},{val:"Brescia",name:"Brescia"},{val:"Venezia",name:"Venezia"},{val:"Modena",name:"Modena"},{val:"Bologna",name:"Bologna"},{val:"Arezzo",name:"Arezzo"}],e.loading=!1;case 4:case"end":return t.stop()}}),t)})))()},signup:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){var n,data;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.password==e.confirmPassword){t.next=3;break}return alert("Le password devono coincidere"),t.abrupt("return");case 3:if(""!=e.email){t.next=6;break}return alert("Inserisci email"),t.abrupt("return");case 6:if(""!=e.password){t.next=9;break}return alert("Inserisci password"),t.abrupt("return");case 9:if(""!=e.name){t.next=12;break}return alert("Inserisci name"),t.abrupt("return");case 12:if(""!=e.surname){t.next=15;break}return alert("Inserisci surname"),t.abrupt("return");case 15:if(""!=e.dateOfBirth){t.next=18;break}return alert("Inserisci dateOfBirth"),t.abrupt("return");case 18:if(""!=e.province){t.next=21;break}return alert("Inserisci province"),t.abrupt("return");case 21:if(""!=e.gender){t.next=24;break}return alert("Inserisci gender"),t.abrupt("return");case 24:return t.prev=24,t.next=27,fetch("/api/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,password:e.password,name:e.name,surname:e.surname,dateOfBirth:e.dateOfBirth,province:e.province,gender:e.gender})});case 27:if((n=t.sent).ok){t.next=37;break}if(400!=n.status){t.next=36;break}return t.next=32,n.json();case 32:throw t.sent.errortext;case 36:throw"Si è verificato un errore. (".concat(n.status,")");case 37:return t.next=39,n.json();case 39:data=t.sent,localStorage.setItem("token",data.token),localStorage.setItem("name",data.name+" "+data.surname),e.$router.push({path:"/login"}),t.next=50;break;case 45:t.prev=45,t.t0=t.catch(24),console.error(t.t0),alert(t.t0),e.loading=!1;case 50:case"end":return t.stop()}}),t,null,[[24,45]])})))()},login:function(){this.$router.push({path:"/login"})},facebook:function(){this.$router.push({path:"/api/signinFacebook"})},google:function(){this.$router.push({path:"/api/signinGoogle"})}}},d=n(44),component=Object(d.a)(c,(function(){var e=this,t=e._self._c;return t("div",[t("Loader",{directives:[{name:"show",rawName:"v-show",value:e.loading,expression:"loading"}]}),e._v(" "),t("TopBar"),e._v(" "),t("div",{staticClass:"text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12"},[t("div",{staticClass:"mb-3 text-2xl"},[e._v("\n      Registrazione\n    ")]),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Indirizzo email\n    ")]),e._v(" "),t("div",[t("Input",{attrs:{type:"email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Password\n    ")]),e._v(" "),t("div",[t("Input",{attrs:{type:"password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Conferma password\n    ")]),e._v(" "),t("div",[t("Input",{attrs:{type:"password"},model:{value:e.confirmPassword,callback:function(t){e.confirmPassword=t},expression:"confirmPassword"}})],1),e._v(" "),t("div",{staticClass:"mt-12"},[e._v("\n      Nome\n    ")]),e._v(" "),t("div",[t("Input",{model:{value:e.name,callback:function(t){e.name=t},expression:"name"}})],1),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Cognome\n    ")]),e._v(" "),t("div",[t("Input",{model:{value:e.surname,callback:function(t){e.surname=t},expression:"surname"}})],1),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Data di nascita\n    ")]),e._v(" "),t("div",[t("Input",{model:{value:e.dateOfBirth,callback:function(t){e.dateOfBirth=t},expression:"dateOfBirth"}})],1),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Provincia\n    ")]),e._v(" "),t("div",[t("Select",{attrs:{options:e.allProvinces},model:{value:e.province,callback:function(t){e.province=t},expression:"province"}})],1),e._v(" "),t("div",{staticClass:"mt-3"},[e._v("\n      Genere\n    ")]),e._v(" "),t("div",[t("Select",{attrs:{options:[{val:"*",name:"Altro"},{val:"M",name:"Uomo"},{val:"F",name:"Donna"}]},model:{value:e.gender,callback:function(t){e.gender=t},expression:"gender"}})],1),e._v(" "),t("div",{staticClass:"mt-12"},[t("Button",{attrs:{text:"Registrati"},on:{click:function(t){return e.signup()}}})],1),e._v(" "),t("div",{staticClass:"mt-12"},[t("Button",{attrs:{text:"Torna al login"},on:{click:function(t){return e.login()}}})],1),e._v(" "),t("div",{staticClass:"mt-12"},[t("Button",{attrs:{text:"Registrati con Facebook"},on:{click:function(t){return e.facebook()}}})],1),e._v(" "),t("div",{staticClass:"mt-12"},[t("Button",{attrs:{text:"Registrati con Google"},on:{click:function(t){return e.google()}}})],1)])],1)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{Loader:n(261).default,TopBar:n(259).default,Input:n(260).default,Select:n(262).default,Button:n(258).default})}}]);