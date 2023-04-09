(window.webpackJsonp=window.webpackJsonp||[]).push([[19,4,6,7,11],{258:function(t,e,n){"use strict";n.r(e);var r={props:{text:{type:String,default:function(){return""}},hollow:{type:Boolean,default:function(){return!1}},icon:{type:String,default:function(){return null}}},data:function(){return{fullClasses:"h-12 bg-blue-400 rounded-full px-7 py-3 hover:text-white hover:bg-blue-500",hollowClasses:"h-12 bg-white border border-blue-400 rounded-full px-7 py-3 hover:text-white hover:bg-blue-500 hover:border-blue-500"}}},o=n(44),component=Object(o.a)(r,(function(){var t=this,e=t._self._c;return e("button",{class:t.hollow?t.hollowClasses:t.fullClasses,on:{click:function(e){return e.stopPropagation(),t.$emit("click")}}},[e("div",{staticClass:"flex justify-between items-center h-full gap-2"},[t.icon?e("img",{staticClass:"h-full",attrs:{src:"/icons/".concat(t.icon,".png")}}):t._e(),t._v(" "),e("span",{class:{"text-white":!t.hollow}},[t._v(" "+t._s(t.text)+" ")])])])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Button:n(258).default})},259:function(t,e,n){"use strict";n.r(e);n(37);var r={props:{backRedirect:{type:String,default:function(){return""}},goBack:{type:Boolean,default:function(){return!1}},backRedirectReplace:{type:Boolean,default:function(){return!1}},backRedirectQuery:{type:Object,default:function(){}}},data:function(){return{name:localStorage.getItem("name"),userId:localStorage.getItem("userId")}}},o=n(44),component=Object(o.a)(r,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"h-10 w-screen items-center bg-blue-500 flex flex-row gap-3 fixed px-4 text-white z-40"},[e("NuxtLink",{directives:[{name:"show",rawName:"v-show",value:t.backRedirect,expression:"backRedirect"}],staticClass:"h-2/4 cursor-pointer",attrs:{to:{path:t.backRedirect,query:t.backRedirectQuery},replace:t.backRedirectReplace}},[e("img",{staticClass:"h-full",attrs:{src:"/icons/back.png"}})]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.backRedirect&&t.goBack,expression:"!backRedirect && goBack"}],staticClass:"h-2/4 cursor-pointer",on:{click:function(e){return t.$router.go(-1)}}},[e("img",{staticClass:"h-full",attrs:{src:"/icons/back.png"}})]),t._v(" "),e("div",{staticClass:"h-full flex-grow"}),t._v(" "),e("div",{staticClass:"h-full absolute left-10"},[e("NuxtLink",{attrs:{to:"/"}},[e("img",{staticClass:"h-full",attrs:{src:"/title.png"}})])],1),t._v(" "),e("div",{staticClass:"text-sm"},[t._v("\n    "+t._s(t.name)+"\n  ")]),t._v(" "),t.name&&t.name.length>0?e("NuxtLink",{staticClass:"h-2/4 cursor-pointer",attrs:{to:{path:"/user",query:{userId:t.userId}}}},[e("img",{staticClass:"h-full",attrs:{src:"/icons/user.png"}})]):t._e()],1)}),[],!1,null,null,null);e.default=component.exports},260:function(t,e,n){"use strict";n.r(e);var r=n(44),component=Object(r.a)({},(function(){return(0,this._self._c)("div",{staticClass:"bg-black bg-opacity-70 w-screen h-screen fixed z-50"})}),[],!1,null,null,null);e.default=component.exports},263:function(t,e,n){"use strict";n.r(e);n(37);var r=n(9),o=(n(30),{props:{passedLoan:{type:Object,default:function(){return{}}},button:{type:String,default:function(){return""}}},data:function(){return{myUserId:localStorage.getItem("userId")}},computed:{imageUrl:function(){return"/api/product/".concat(this.passedLoan.product.id,"/image")},formattedDate:function(){return this.passedLoan?this.$formatDate(this.passedLoan.requestDate):""},formattedLoanDays:function(){return this.passedLoan?this.passedLoan.remainingDays+(this.passedLoan.remainingDays>1?" giorni":" giorno"):""}},methods:{markDeposit:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=null,e.t0=t.button,e.next="startLoan"===e.t0?4:"endLoan"===e.t0?6:"requestReturnLocker"===e.t0?8:10;break;case 4:return n="/api/loan/start/"+t.passedLoan.product.id,e.abrupt("break",11);case 6:return n="/api/loan/close/"+t.passedLoan.product.id,e.abrupt("break",11);case 8:return n="/api/book/return/"+t.passedLoan.product.id,e.abrupt("break",11);case 10:return e.abrupt("return");case 11:return t.$emit("startLoading"),e.next=14,t.$callApi(n,"GET");case 14:(r=e.sent).error?409==r.errorStatus&&alert("Impossibile prenotare uno slot per la restituzione del prodotto. Riprovare"):(alert("Operazione effettuata correttamente. Controlla la tua casella di posta elettronica per ulteriori informazioni"),t.$router.go(0)),t.$emit("endLoading");case 17:case"end":return e.stop()}}),e)})))()}}}),l=n(44),component=Object(l.a)(o,(function(){var t,e,n,r=this,o=r._self._c;return o("div",{staticClass:"w-96 border border-solid border-gray-200 rounded-md shadow flex-shrink-0 flex flex-col items-center",staticStyle:{height:"32rem","max-width":"95vw"}},[o("div",{staticClass:"h-3/4 overflow-hidden flex items-center"},[o("img",{staticClass:"w-full",attrs:{src:r.imageUrl}})]),r._v(" "),r.passedLoan.alreadyStarted?o("div",{staticClass:"text-left w-11/12 flex-grow break-words font-light text-sm"},[r._v("\n    Prodotto in prestito dal "+r._s(r.$formatDate(r.passedLoan.loanStartDate))+" (tempo rimanente: "+r._s(r.formattedLoanDays)+")\n  ")]):r._e(),r._v(" "),o("div",{staticClass:"text-left w-11/12 flex justify-between"},[o("div",{staticClass:"font-bold flex-grow truncate whitespace-nowrap w-2/4"},[r._v("\n      "+r._s(r.passedLoan.product.title)+"\n    ")])]),r._v(" "),o("div",{staticClass:"text-left w-11/12 flex justify-between"},[o("div",{staticClass:"flex-grow text-right truncate whitespace-nowrap w-2/4"},[r.myUserId!=r.passedLoan.owner.id?o("span",[r._v("\n        Di\n        "),o("NuxtLink",{staticClass:"underline text-blue-500",attrs:{to:{path:"/user",query:{userId:r.passedLoan.owner.id}}}},[r._v("\n          "+r._s(r.passedLoan.owner.name)+" "+r._s(r.passedLoan.owner.surname)+"\n        ")])],1):r._e(),r._v(" "),r.myUserId!=r.passedLoan.borrower.id?o("span",[r._v("\n        Prestato a\n        "),o("NuxtLink",{staticClass:"underline text-blue-500",attrs:{to:{path:"/user",query:{userId:r.passedLoan.borrower.id}}}},[r._v("\n          "+r._s(r.passedLoan.borrower.name)+" "+r._s(r.passedLoan.borrower.surname)+"\n        ")])],1):r._e()])]),r._v(" "),r.passedLoan.locker?o("div",{staticClass:"text-left w-11/12 flex-grow break-words"},[o("div",[r._v("\n      Locker "+r._s(null===(t=r.passedLoan.locker)||void 0===t?void 0:t.name)+" ("+r._s(null===(e=r.passedLoan.locker)||void 0===e?void 0:e.address)+", "+r._s(null===(n=r.passedLoan.locker)||void 0===n?void 0:n.province)+")\n    ")]),r._v(" "),o("div",[r._v("\n      Slot del locker: "+r._s(r.passedLoan.lockerSlot)+"\n    ")]),r._v(" "),r.passedLoan.returnSlotBooked?o("div",[r._v("\n      Slot del locker di restituzione: "+r._s(r.passedLoan.returnLockerSlot)+"\n    ")]):r._e()]):r._e(),r._v(" "),r.passedLoan.terminationDate||""==r.button?r._e():o("div",{staticClass:"text-right w-11/12 mt-2 mb-2"},[o("Button",{attrs:{text:"requestReturnLocker"==r.button?"Prenota locker":"Conferma deposito"},on:{click:function(t){return r.markDeposit()}}})],1),r._v(" "),o("div",{staticClass:"text-right w-11/12 font-light text-sm"},[r._v("\n    Richiesta di prestito effettuata il "+r._s(r.formattedDate)+"\n  ")]),r._v(" "),r.passedLoan.loanStartDate?o("div",{staticClass:"text-right w-11/12 font-light text-sm"},[r._v("\n    Prestito avviato il "+r._s(r.$formatDate(r.passedLoan.loanStartDate))+"\n  ")]):r._e(),r._v(" "),r.passedLoan.terminationDate?o("div",{staticClass:"text-right w-11/12 font-light text-sm"},[r._v("\n    Prestito terminato il "+r._s(r.$formatDate(r.passedLoan.requestDate))+"\n  ")]):r._e()])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Button:n(258).default})},282:function(t,e,n){"use strict";n.r(e);var r=n(9),o=(n(30),{data:function(){return{myLoans:[],othersLoans:[],loading:!0}},created:function(){this.getAllLoans()},methods:{getAllLoans:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$callApi("/api/loans/ended","GET");case 2:return n=e.sent,e.next=5,t.$callApi("/api/loans/requested","GET");case 5:r=e.sent,n.data&&r.data&&(t.myLoans=n.data.loans,t.othersLoans=r.data.loans),t.loading=!1;case 8:case"end":return e.stop()}}),e)})))()},goToCreateProduct:function(){this.$router.push({path:"/createProduct"})}}}),l=n(44),component=Object(l.a)(o,(function(){var t=this,e=t._self._c;return e("div",[e("Loader",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}]}),t._v(" "),e("TopBar",{attrs:{"go-back":""}}),t._v(" "),e("div",{staticClass:"text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12 pb-24"},[t.loading||0!=t.myLoans.length||0!=t.othersLoans.length?t.loading?t._e():e("div",[t.myLoans.length>0?e("div",[e("span",{staticClass:"text-3xl"},[t._v(" Prestiti effettuati ")]),t._v(" "),e("div",{staticClass:"flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24"},t._l(t.myLoans,(function(n){return e("LoanCard",{key:n.id,attrs:{"passed-loan":n,button:"startLoan"},on:{startLoading:function(e){t.loading=!0},endLoading:function(e){t.loading=!1}}})})),1)]):t._e(),t._v(" "),t.othersLoans.length>0?e("div",[e("span",{staticClass:"text-3xl"},[t._v(" Prestiti richiesti ")]),t._v(" "),e("div",{staticClass:"flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24"},t._l(t.othersLoans,(function(n){return e("LoanCard",{key:n.id,attrs:{"passed-loan":n},on:{startLoading:function(e){t.loading=!0},endLoading:function(e){t.loading=!1}}})})),1)]):t._e()]):e("div",{staticClass:"text-2xl mt-2 text-center"},[t._v("\n      Non hai prestiti nello storico 👀️\n    ")]),t._v(" "),e("Button",{staticClass:"fixed right-4 bottom-6",attrs:{text:"Crea inserzione",icon:"plus"},on:{click:function(e){return t.goToCreateProduct()}}})],1)],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Loader:n(260).default,TopBar:n(259).default,LoanCard:n(263).default,Button:n(258).default})}}]);