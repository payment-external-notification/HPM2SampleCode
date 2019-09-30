/*    Copyright (c) 2014 Zuora, Inc.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of 
 *   this software and associated documentation files (the "Software"), to use copy, 
 *   modify, merge, publish the Software and to distribute, and sublicense copies of 
 *   the Software, provided no fee is charged for the Software.  In addition the
 *   rights specified above are conditioned upon the following:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   Zuora, Inc. or any other trademarks of Zuora, Inc.  may not be used to endorse
 *   or promote products derived from this Software without specific prior written
 *   permission from Zuora, Inc.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL
 *   ZUORA, INC. BE LIABLE FOR ANY DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES
 *   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 *   ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var ifrmId="z_hppm_iframe";if(!String.prototype.trim){(function(){var a=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;String.prototype.trim=function(){return this.replace(a,"")}})()}if(!Object.keys){Object.keys=(function(){var c=Object.prototype.hasOwnProperty,d=!({toString:null}).propertyIsEnumerable("toString"),b=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],a=b.length;return function(g){if(typeof g!=="object"&&(typeof g!=="function"||g===null)){throw new TypeError("Object.keys called on non-object")}var e=[],h,f;for(h in g){if(c.call(g,h)){e.push(h)}}if(d){for(f=0;f<a;f++){if(c.call(g,b[f])){e.push(b[f])}}}return e}}())}(function(){if(!Event.prototype.preventDefault){Event.prototype.preventDefault=function(){this.returnValue=false}}if(!Event.prototype.stopPropagation){Event.prototype.stopPropagation=function(){this.cancelBubble=true}}if(!Element.prototype.addEventListener){var c=[];var b=function(f,h){var d=this;var j=function(k){k.target=k.srcElement;k.currentTarget=d;if(h.handleEvent){h.handleEvent(k)}else{h.call(d,k)}};if(f=="DOMContentLoaded"){var g=function(k){if(document.readyState=="complete"){j(k)}};document.attachEvent("onreadystatechange",g);c.push({object:this,type:f,listener:h,wrapper:g});if(document.readyState=="complete"){var i=new Event();i.srcElement=window;g(i)}}else{if(this.attachEvent){this.attachEvent("on"+f,j)}c.push({object:this,type:f,listener:h,wrapper:j})}};var a=function(f,g){var d=0;while(d<c.length){var e=c[d];if(e.object==this&&e.type==f&&e.listener==g){if(f=="DOMContentLoaded"){this.detachEvent("onreadystatechange",e.wrapper)}else{this.detachEvent("on"+f,e.wrapper)}c.splice(d,1);break}++d}};Element.prototype.addEventListener=b;Element.prototype.removeEventListener=a;if(HTMLDocument){HTMLDocument.prototype.addEventListener=b;HTMLDocument.prototype.removeEventListener=a}if(Window&&Window.prototype){Window.prototype.addEventListener=b;Window.prototype.removeEventListener=a}}})();var Z=function(){var h="#z-overlay {filter: alpha(opacity=50);opacity:0.5;display:inline-block;position:fixed;top:0;left:0;width:100%;height:100%;background-color: #000;z-index: 1001;}";
var e="#z-container {border:1px;float:left; overflow: visible; position: absolute;padding: 0px; display: inline-block; top:5%; left:34%; margin: 0 auto;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius:5px;background-color: #FAFAFA; border:1px solid #FAFAFA;border-top-color:#EDEDED;behavior: url(js/PIE.htc);z-index: 1002;}";var m="#z-data {height: 100%; outline: 0px; width: 100%; overflow: visible;display: inline-block;border:1px; -webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius:5px;}";var j="#reset{*, *:before, *:after {display: inline-block;-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}}";var g="#z_hppm_iframe {background-color: #FAFAFA;vertical-align:bottom;z-index:9999;display:block;padding:0px;margin: 0px; border:0px solid #DDD;}";var b="requestPage";var k;var l,f,d;var i=["tenantId","id","token","signature","key","style","submitEnabled","url"];var c=["creditCardNumber","cardSecurityCode","creditCardExpirationYear","creditCardExpirationMonth"];var a=false;return{validateRequiredParams:function(q){var n=i.length;for(index=0;index<n;index++){if(!q.hasOwnProperty(i[index])){if(i[index]=="submitEnabled"&&q.style.toLowerCase()=="overlay"){continue}else{var o="Param with key ["+i[index]+"] is required.";alert(o);if(!Z.isIE()){console.log(o)}return false}}}return true},isIE:function(){var q=window.navigator.userAgent;var o=q.indexOf("MSIE ");var n=q.indexOf("Trident/");if(o>0){return true}if(n>0){var r=q.indexOf("rv:");return true}return false},validatePCIParams:function(r){var n=c.length;for(index=0;index<n;index++){var o="field_"+c[index];if(r.hasOwnProperty(o)){if(0<r[o].trim().length&&r[o].trim().length<300){var q="Field ["+o+"] for Credit Card payment method type should be encrypted for pre-population";alert(q);if(!Z.isIE()){console.log(q)}return false}}}return true},init:function(q,r){l="?method=requestPage&host="+encodeURIComponent(document.location.href)+"&";var o=Z.validateRequiredParams(q);if(!o){return false}o=Z.validatePCIParams(q);if(!o){return false
}var n=JSON.stringify(q,function(s,t){if(s!=""){if("key"==s){d=t}else{if("url"==s){k=t}else{l=l+s+"="+encodeURIComponent(t)+"&"}}}return t});p=JSON.parse(n);if(!a){ZXD.receiveMessage(function(t){var s=t.data;s=JSON.parse(s);if(s.success){if(r){r(s)}else{Z.responseHandler(s)}}else{if(s.success==false){Z.deactivateOverlay("z-overlay");Z.deactivateOverlay("z-container");r(s)}else{if(s.action=="close"){Z.deactivateOverlay("z-overlay");Z.deactivateOverlay("z-container")}else{if(s.action=="resize"){Z.receive(s)}else{Z.receive(s)}}}}});a=true}return true},prepopulate:function(q){var r=Z.createIframeURL();if(r==document.getElementById(ifrmId).src){var n=JSON.stringify(q,function(s,u){if(s!=""){var t="setField("+s+":"+u+")";Z.post(ifrmId,t)}return u});var o="setField(key:"+d+")";Z.post(ifrmId,o);Z.post(ifrmId,"setField(style:"+p.style+")");Z.post(ifrmId,"resize")}},render:function(t,v,u){if(v&&v.creditCardCountry&&(v.creditCardCountry==="USA"||v.creditCardCountry==="CAN")){v.creditCardState=v.creditCardState||" "}var q=Z.init(t,u);if(!q){return}f=v;var r=document.getElementById("zuora_payment");if(typeof r=="undefined"||!r){return{error:"invalid_request",error_description:"The container you specified does not exist"}}Z.cleanUp(r,"z-overlay");Z.cleanUp(r,"z-container");if(p.style=="inline"){Z.addInlineStyles();Z.createIframe(r);return}if(p.style=="overlay"){Z.addOverlayStyles();var o=Z.generateDiv("z-overlay","z-overlay");r.appendChild(o);var s=Z.generateDiv("z-container","z-container");r.appendChild(s);var n=Z.generateDiv("z-data","z-data");n.tabindex="-1";s.appendChild(n);Z.createIframe(document.getElementById("z-data"));Z.activateOverlay("z-overlay")}},cleanUp:function(o,n){var q=document.getElementById(n);if(q!=null){o.removeChild(q)}},activateOverlay:function(o){try{document.getElementById(o).style.display="inline"}catch(n){}},deactivateOverlay:function(o){try{document.getElementById(o).style.display="none"}catch(n){}},generateDiv:function(r,o,n){var q=document.createElement("div");q.id=r;q.className=o;q.border="0";if(q.addEventListener){q.addEventListener("click",n,false)
}else{q.attachEvent("click",n)}return q},addOverlayStyles:function(){var s=document.createElement("style");s.type="text/css";var o=document.createTextNode(h);var t=document.createTextNode(e);var n=document.createTextNode(m);var r=document.createTextNode(g);var q=document.createTextNode(j);if(s.styleSheet){s.styleSheet.cssText=o.nodeValue+" "+t.nodeValue+" "+n.nodeValue+" "+q.nodeValue+" "+r.nodeValue}else{s.appendChild(o);s.appendChild(t);s.appendChild(n);s.appendChild(r);s.appendChild(q)}document.getElementsByTagName("head")[0].appendChild(s)},addInlineStyles:function(){var o=document.createElement("style");o.type="text/css";var n=document.createTextNode(g);if(o.styleSheet){o.styleSheet.cssText=n.nodeValue}else{o.appendChild(n)}document.getElementsByTagName("head")[0].appendChild(o)},createIframe:function(n){var q=Z.createIframeURL();var o=document.createElement("iframe");o.setAttribute("src",q);o.setAttribute("id",ifrmId);o.setAttribute("overflow","visible");o.setAttribute("scrolling","no");o.setAttribute("frameBorder","0");o.setAttribute("allowtransparency","true");o.setAttribute("class","z_hppm_iframe");o.setAttribute("width","100%");o.setAttribute("height","100%");if(o.addEventListener){o.addEventListener("load",function(r){Z.prepopulate(f);return false},false)}else{o.attachEvent("onload",function(){Z.prepopulate(f);return false})}if(typeof options!="undefined"){if(typeof options.vertical!="undefined"&&options.vertical){o.style.width="100%";o.style.height="100%"}}n.appendChild(o)},createIframeURL:function(){var n=k;return n.concat(l)},post:function(r,q){var n=document.getElementById(r);var o=encodeURIComponent(document.location.href);var s=n.src;if(s.indexOf(o)<=-1){n.src=s+"#"+o}ZXD.postMessage(q,s,n.contentWindow);return false},receive:function(n){ZFB.resizeCaller(ifrmId,n.action,n.height,n.width)},validate:function(){return document.getElementById(ifrmId).contentWindow.ZLT.validate()},submit:function(){var n=document.getElementById(ifrmId).src+"#"+encodeURIComponent(document.location.href);document.getElementById(ifrmId).src=n;
ZXD.postMessage("postPage",n,document.getElementById(ifrmId).contentWindow);return true},responseHandler:function(n){var o=n.redirectUrl;if(n.success){var q=o+"?refId="+n.refId+"&success="+n.success+"&signature="+n.signature+"&token="+n.token;window.location.replace(q)}else{var q=o+"?errorCode="+n.errorCode+"&errorMessage="+n.errorMessage+"&success="+n.success+"&signature="+n.signature+"&token="+n.token;window.location.replace(q)}}}}();var ZXD=function(){var e,d,b=1,c,a=this;return{postMessage:function(f,h,g){if(!h){return}g=g||parent;if(a.postMessage){g.postMessage(f,h.replace(/([^:]+:\/\/[^\/]+).*/,"$1"))}else{if(h){g.location=h.replace(/#.*$/,"")+"#"+(+new Date)+(b++)+"&"+f}}},receiveMessage:function(h,g,f){if(a.postMessage){if(h){c=function(l){if(Object.prototype.toString.call(g)==="[object Function]"&&g(l.origin)===!1){return !1}if(typeof g==="string"&&l.origin!==g){if(!f){return !1}else{if(f==="true"){try{if(typeof g==="string"){var i=l.origin.split(".");if(i){var n=i.slice(-2).join(".");var j=g.split(".");var m=j.slice(-2).join(".");if(m.indexOf(n)<=-1){return !1}}}}catch(k){return !1}}else{return !1}}}h(l)}}if(a.addEventListener){a[h?"addEventListener":"removeEventListener"]("message",c,!1)}else{a[h?"attachEvent":"detachEvent"]("onmessage",c)}}else{e&&clearInterval(e);e=null;if(h){e=setInterval(function(){var j=document.location.hash,i=/^#?\d+&/;if(j!==d&&i.test(j)){d=j;h({data:j.replace(i,"")})}},100)}}}}}();var ZFB=function(){var b="yes";var c=navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1];var a=parseFloat(c)>=0.1?20:0;return{resizeCaller:function(h,g,d,f){ZFB.resizeIframe(h,g,d,f);if((document.all||document.getElementById)&&b=="no"){var e=document.all?document.all[h]:document.getElementById(h);e.style.display="block"}},resizeIframe:function(f,h,e,g){var d=document.getElementById(f);if(d){d.style.display="block";d.height=Number(e);d.width=Number(g)}}}}();