(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{265:function(t,e,r){"use strict";r.r(e);r(37),r(31),r(45);var d={props:{passedProduct:{type:Object,default:function(){return{}}}},computed:{imageUrl:function(){return"/api/product/".concat(this.passedProduct.id,"/image")},formattedDate:function(){return this.passedProduct?this.$formatDate(this.passedProduct.insertionDate):""},disabled:function(){return"availability"in this.passedProduct&&!this.passedProduct.availability}}},o=r(44),component=Object(o.a)(d,(function(){var t=this,e=t._self._c;return e("NuxtLink",{attrs:{to:{path:"/productDetails",query:{idProduct:t.passedProduct.id}}}},[e("div",{staticClass:"w-96 border border-solid border-gray-200 rounded-md shadow flex-shrink-0 flex flex-col items-center cursor-pointer relative",staticStyle:{height:"32rem","max-width":"95vw"}},[t.disabled?e("div",{staticClass:"absolute inset-0 bg-black opacity-20"}):t._e(),t._v(" "),e("div",{staticClass:"h-3/4 overflow-hidden flex items-center"},[e("img",{staticClass:"w-full",attrs:{src:t.imageUrl}})]),t._v(" "),e("div",{staticClass:"text-left w-11/12 flex justify-between"},[e("div",{staticClass:"font-bold flex-grow truncate whitespace-nowrap w-2/4"},[t._v("\n        "+t._s(t.passedProduct.title)+"\n      ")]),t._v(" "),e("div",{staticClass:"flex-grow text-right truncate whitespace-nowrap w-2/4 underline text-blue-500"},[e("NuxtLink",{attrs:{to:{path:"/user",query:{userId:t.passedProduct.user.id}}}},[t._v("\n          "+t._s(t.passedProduct.user.name)+" "+t._s(t.passedProduct.user.surname)+"\n        ")])],1)]),t._v(" "),e("div",{staticClass:"text-left w-11/12 flex-grow break-words"},[t._v("\n      "+t._s(t.passedProduct.description)+"\n    ")]),t._v(" "),e("div",{staticClass:"text-right w-11/12 font-light text-sm"},[t._v("\n      "+t._s(t.formattedDate)+"\n    ")])])])}),[],!1,null,null,null);e.default=component.exports}}]);