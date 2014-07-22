// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/**
 * jQuery Geocoding and Places Autocomplete Plugin - V 1.5.0
 *
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function($,window,document,undefined){var defaults={bounds:true,country:null,map:false,details:false,detailsAttribute:"name",autoselect:true,location:false,mapOptions:{zoom:14,scrollwheel:false,mapTypeId:"roadmap"},markerOptions:{draggable:false},maxZoom:16,types:["geocode"],blur:false};var componentTypes=("street_address route intersection political "+"country administrative_area_level_1 administrative_area_level_2 "+"administrative_area_level_3 colloquial_area locality sublocality "+"neighborhood premise subpremise postal_code natural_feature airport "+"park point_of_interest post_box street_number floor room "+"lat lng viewport location "+"formatted_address location_type bounds").split(" ");var placesDetails=("id url website vicinity reference name rating "+"international_phone_number icon formatted_phone_number").split(" ");function GeoComplete(input,options){this.options=$.extend(true,{},defaults,options);this.input=input;this.$input=$(input);this._defaults=defaults;this._name="geocomplete";this.init()}$.extend(GeoComplete.prototype,{init:function(){this.initMap();this.initMarker();this.initGeocoder();this.initDetails();this.initLocation()},initMap:function(){if(!this.options.map){return}if(typeof this.options.map.setCenter=="function"){this.map=this.options.map;return}this.map=new google.maps.Map($(this.options.map)[0],this.options.mapOptions);google.maps.event.addListener(this.map,"click",$.proxy(this.mapClicked,this));google.maps.event.addListener(this.map,"zoom_changed",$.proxy(this.mapZoomed,this))},initMarker:function(){if(!this.map){return}var options=$.extend(this.options.markerOptions,{map:this.map});if(options.disabled){return}this.marker=new google.maps.Marker(options);google.maps.event.addListener(this.marker,"dragend",$.proxy(this.markerDragged,this))},initGeocoder:function(){var options={types:this.options.types,bounds:this.options.bounds===true?null:this.options.bounds,componentRestrictions:this.options.componentRestrictions};if(this.options.country){options.componentRestrictions={country:this.options.country}}this.autocomplete=new google.maps.places.Autocomplete(this.input,options);this.geocoder=new google.maps.Geocoder;if(this.map&&this.options.bounds===true){this.autocomplete.bindTo("bounds",this.map)}google.maps.event.addListener(this.autocomplete,"place_changed",$.proxy(this.placeChanged,this));this.$input.keypress(function(event){if(event.keyCode===13){return false}});this.$input.bind("geocode",$.proxy(function(){this.find()},this));if(this.options.blur===true){this.$input.blur($.proxy(function(){this.find()},this))}},initDetails:function(){if(!this.options.details){return}var $details=$(this.options.details),attribute=this.options.detailsAttribute,details={};function setDetail(value){details[value]=$details.find("["+attribute+"="+value+"]")}$.each(componentTypes,function(index,key){setDetail(key);setDetail(key+"_short")});$.each(placesDetails,function(index,key){setDetail(key)});this.$details=$details;this.details=details},initLocation:function(){var location=this.options.location,latLng;if(!location){return}if(typeof location=="string"){this.find(location);return}if(location instanceof Array){latLng=new google.maps.LatLng(location[0],location[1])}if(location instanceof google.maps.LatLng){latLng=location}if(latLng){if(this.map){this.map.setCenter(latLng)}if(this.marker){this.marker.setPosition(latLng)}}},find:function(address){this.geocode({address:address||this.$input.val()})},geocode:function(request){if(this.options.bounds&&!request.bounds){if(this.options.bounds===true){request.bounds=this.map&&this.map.getBounds()}else{request.bounds=this.options.bounds}}if(this.options.country){request.region=this.options.country}this.geocoder.geocode(request,$.proxy(this.handleGeocode,this))},selectFirstResult:function(){var selected="";if($(".pac-item-selected")["0"]){selected="-selected"}var $span1=$(".pac-container .pac-item"+selected+":first span:nth-child(2)").text();var $span2=$(".pac-container .pac-item"+selected+":first span:nth-child(3)").text();var firstResult=$span1;if($span2){firstResult+=" - "+$span2}this.$input.val(firstResult);return firstResult},handleGeocode:function(results,status){if(status===google.maps.GeocoderStatus.OK){var result=results[0];this.$input.val(result.formatted_address);this.update(result);if(results.length>1){this.trigger("geocode:multiple",results)}}else{this.trigger("geocode:error",status)}},trigger:function(event,argument){this.$input.trigger(event,[argument])},center:function(geometry){if(geometry.viewport){this.map.fitBounds(geometry.viewport);if(this.map.getZoom()>this.options.maxZoom){this.map.setZoom(this.options.maxZoom)}}else{this.map.setZoom(this.options.maxZoom);this.map.setCenter(geometry.location)}if(this.marker){this.marker.setPosition(geometry.location);this.marker.setAnimation(this.options.markerOptions.animation)}},update:function(result){if(this.map){this.center(result.geometry)}if(this.$details){this.fillDetails(result)}this.trigger("geocode:result",result)},fillDetails:function(result){var data={},geometry=result.geometry,viewport=geometry.viewport,bounds=geometry.bounds;$.each(result.address_components,function(index,object){var name=object.types[0];data[name]=object.long_name;data[name+"_short"]=object.short_name});$.each(placesDetails,function(index,key){data[key]=result[key]});$.extend(data,{formatted_address:result.formatted_address,location_type:geometry.location_type||"PLACES",viewport:viewport,bounds:bounds,location:geometry.location,lat:geometry.location.lat(),lng:geometry.location.lng()});$.each(this.details,$.proxy(function(key,$detail){var value=data[key];this.setDetail($detail,value)},this));this.data=data},setDetail:function($element,value){if(value===undefined){value=""}else if(typeof value.toUrlValue=="function"){value=value.toUrlValue()}if($element.is(":input")){$element.val(value)}else{$element.text(value)}},markerDragged:function(event){this.trigger("geocode:dragged",event.latLng)},mapClicked:function(event){this.trigger("geocode:click",event.latLng)},mapZoomed:function(event){this.trigger("geocode:zoom",this.map.getZoom())},resetMarker:function(){this.marker.setPosition(this.data.location);this.setDetail(this.details.lat,this.data.location.lat());this.setDetail(this.details.lng,this.data.location.lng())},placeChanged:function(){var place=this.autocomplete.getPlace();if(!place.geometry){if(this.options.autoselect){var autoSelection=this.selectFirstResult();this.find(autoSelection)}}else{this.update(place)}}});$.fn.geocomplete=function(options){var attribute="plugin_geocomplete";if(typeof options=="string"){var instance=$(this).data(attribute)||$(this).geocomplete().data(attribute),prop=instance[options];if(typeof prop=="function"){prop.apply(instance,Array.prototype.slice.call(arguments,1));return $(this)}else{if(arguments.length==2){prop=arguments[1]}return prop}}else{return this.each(function(){var instance=$.data(this,attribute);if(!instance){instance=new GeoComplete(this,options);$.data(this,attribute,instance)}})}}})(jQuery,window,document);


/*! TinySort
* Copyright (c) 2008-2013 Ron Valstar http://tinysort.sjeiti.com/
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*//*
* Description:
*   A jQuery plugin to sort child nodes by (sub) contents or attributes.
*
* Contributors:
*   brian.gibson@gmail.com
*   michael.thornberry@gmail.com
*
* Usage:
*   $("ul#people>li").tsort();
*   $("ul#people>li").tsort("span.surname");
*   $("ul#people>li").tsort("span.surname",{order:"desc"});
*   $("ul#people>li").tsort({place:"end"});
*   $("ul#people>li").tsort("span.surname",{order:"desc"},span.name");
*
* Change default like so:
*   $.tinysort.defaults.order = "desc";
*
*/
;(function($,undefined) {
    'use strict';
    // private vars
    var fls = !1                            // minify placeholder
        ,nll = null                         // minify placeholder
        ,prsflt = parseFloat                // minify placeholder
        ,mathmn = Math.min                  // minify placeholder
        ,rxLastNr = /(-?\d+\.?\d*)$/g       // regex for testing strings ending on numbers
        ,rxLastNrNoDash = /(\d+\.?\d*)$/g   // regex for testing strings ending on numbers ignoring dashes
        ,aPluginPrepare = []
        ,aPluginSort = []
        ,isString = function(o){return typeof o=='string';}
        ,loop = function(array,func){
            var l = array.length
                ,i = l
                ,j;
            while (i--) {
                j = l-i-1;
                func(array[j],j);
            }
        }
        // Array.prototype.indexOf for IE (issue #26) (local variable to prevent unwanted prototype pollution)
        ,fnIndexOf = Array.prototype.indexOf||function(elm) {
            var len = this.length
                ,from = Number(arguments[1])||0;
            from = from<0?Math.ceil(from):Math.floor(from);
            if (from<0) from += len;
            for (;from<len;from++){
                if (from in this && this[from]===elm) return from;
            }
            return -1;
        }
    ;
    //
    // init plugin
    $.tinysort = {
         id: 'TinySort'
        ,version: '1.5.6'
        ,copyright: 'Copyright (c) 2008-2013 Ron Valstar'
        ,uri: 'http://tinysort.sjeiti.com/'
        ,licensed: {
            MIT: 'http://www.opensource.org/licenses/mit-license.php'
            ,GPL: 'http://www.gnu.org/licenses/gpl.html'
        }
        ,plugin: (function(){
            var fn = function(prepare,sort){
                aPluginPrepare.push(prepare);   // function(settings){doStuff();}
                aPluginSort.push(sort);         // function(valuesAreNumeric,sA,sB,iReturn){doStuff();return iReturn;}
            };
            // expose stuff to plugins
            fn.indexOf = fnIndexOf;
            return fn;
        })()
        ,defaults: { // default settings

             order: 'asc'           // order: asc, desc or rand

            ,attr: nll              // order by attribute value
            ,data: nll              // use the data attribute for sorting
            ,useVal: fls            // use element value instead of text

            ,place: 'start'         // place ordered elements at position: start, end, org (original position), first
            ,returns: fls           // return all elements or only the sorted ones (true/false)

            ,cases: fls             // a case sensitive sort orders [aB,aa,ab,bb]
            ,forceStrings:fls       // if false the string '2' will sort with the value 2, not the string '2'

            ,ignoreDashes:fls       // ignores dashes when looking for numerals

            ,sortFunction: nll      // override the default sort function
        }
    };
    $.fn.extend({
        tinysort: function() {
            var i,j,l
                ,oThis = this
                ,aNewOrder = []
                // sortable- and non-sortable list per parent
                ,aElements = []
                ,aElementsParent = [] // index reference for parent to aElements
                // multiple sort criteria (sort===0?iCriteria++:iCriteria=0)
                ,aCriteria = []
                ,iCriteria = 0
                ,iCriteriaMax
                //
                ,aFind = []
                ,aSettings = []
                //
                ,fnPluginPrepare = function(_settings){
                    loop(aPluginPrepare,function(fn){
                        fn.call(fn,_settings);
                    });
                }
                //
                ,fnPrepareSortElement = function(settings,element){
                    if (typeof element=='string') {
                        // if !settings.cases
                        if (!settings.cases) element = toLowerCase(element);
                        element = element.replace(/^\s*(.*?)\s*$/i, '$1');
                    }
                    return element;
                }
                //
                ,fnSort = function(a,b) {
                    var iReturn = 0;
                    if (iCriteria!==0) iCriteria = 0;
                    while (iReturn===0&&iCriteria<iCriteriaMax) {
                        var oPoint = aCriteria[iCriteria]
                            ,oSett = oPoint.oSettings
                            ,rxLast = oSett.ignoreDashes?rxLastNrNoDash:rxLastNr
                        ;
                        //
                        fnPluginPrepare(oSett);
                        //
                        if (oSett.sortFunction) { // custom sort
                            iReturn = oSett.sortFunction(a,b);
                        } else if (oSett.order=='rand') { // random sort
                            iReturn = Math.random()<0.5?1:-1;
                        } else { // regular sort
                            var bNumeric = fls
                                // prepare sort elements
                                ,sA = fnPrepareSortElement(oSett,a.s[iCriteria])
                                ,sB = fnPrepareSortElement(oSett,b.s[iCriteria])
                            ;
                            // maybe force Strings
                            if (!oSett.forceStrings) {
                                // maybe mixed
                                var  aAnum = isString(sA)?sA&&sA.match(rxLast):fls
                                    ,aBnum = isString(sB)?sB&&sB.match(rxLast):fls;
                                if (aAnum&&aBnum) {
                                    var  sAprv = sA.substr(0,sA.length-aAnum[0].length)
                                        ,sBprv = sB.substr(0,sB.length-aBnum[0].length);
                                    if (sAprv==sBprv) {
                                        bNumeric = !fls;
                                        sA = prsflt(aAnum[0]);
                                        sB = prsflt(aBnum[0]);
                                    }
                                }
                            }
                            iReturn = oPoint.iAsc*(sA<sB?-1:(sA>sB?1:0));
                        }

                        loop(aPluginSort,function(fn){
                            iReturn = fn.call(fn,bNumeric,sA,sB,iReturn);
                        });

                        if (iReturn===0) iCriteria++;
                    }

                    return iReturn;
                }
            ;
            // fill aFind and aSettings but keep length pairing up
            for (i=0,l=arguments.length;i<l;i++){
                var o = arguments[i];
                if (isString(o))    {
                    if (aFind.push(o)-1>aSettings.length) aSettings.length = aFind.length-1;
                } else {
                    if (aSettings.push(o)>aFind.length) aFind.length = aSettings.length;
                }
            }
            if (aFind.length>aSettings.length) aSettings.length = aFind.length; // todo: and other way around?

            // fill aFind and aSettings for arguments.length===0
            iCriteriaMax = aFind.length;
            if (iCriteriaMax===0) {
                iCriteriaMax = aFind.length = 1;
                aSettings.push({});
            }

            for (i=0,l=iCriteriaMax;i<l;i++) {
                var sFind = aFind[i]
                    ,oSettings = $.extend({}, $.tinysort.defaults, aSettings[i])
                    // has find, attr or data
                    ,bFind = !(!sFind||sFind==='')
                    // since jQuery's filter within each works on array index and not actual index we have to create the filter in advance
                    ,bFilter = bFind&&sFind[0]===':'
                ;
                aCriteria.push({ // todo: only used locally, find a way to minify properties
                     sFind: sFind
                    ,oSettings: oSettings
                    // has find, attr or data
                    ,bFind: bFind
                    ,bAttr: !(oSettings.attr===nll||oSettings.attr==='')
                    ,bData: oSettings.data!==nll
                    // filter
                    ,bFilter: bFilter
                    ,$Filter: bFilter?oThis.filter(sFind):oThis
                    ,fnSort: oSettings.sortFunction
                    ,iAsc: oSettings.order=='asc'?1:-1
                });
            }
            //
            // prepare oElements for sorting
            oThis.each(function(i,el) {
                var $Elm = $(el)
                    ,mParent = $Elm.parent().get(0)
                    ,mFirstElmOrSub // we still need to distinguish between sortable and non-sortable elements (might have unexpected results for multiple criteria)
                    ,aSort = []
                ;
                for (j=0;j<iCriteriaMax;j++) {
                    var oPoint = aCriteria[j]
                        // element or sub selection
                        ,mElmOrSub = oPoint.bFind?(oPoint.bFilter?oPoint.$Filter.filter(el):$Elm.find(oPoint.sFind)):$Elm;
                    // text or attribute value
                    aSort.push(oPoint.bData?mElmOrSub.data(oPoint.oSettings.data):(oPoint.bAttr?mElmOrSub.attr(oPoint.oSettings.attr):(oPoint.oSettings.useVal?mElmOrSub.val():mElmOrSub.text())));
                    if (mFirstElmOrSub===undefined) mFirstElmOrSub = mElmOrSub;
                }
                // to sort or not to sort
                var iElmIndex = fnIndexOf.call(aElementsParent,mParent);
                if (iElmIndex<0) {
                    iElmIndex = aElementsParent.push(mParent) - 1;
                    aElements[iElmIndex] = {s:[],n:[]}; // s: sort, n: not sort
                }
                if (mFirstElmOrSub.length>0)    aElements[iElmIndex].s.push({s:aSort,e:$Elm,n:i}); // s:string/pointer, e:element, n:number
                else                            aElements[iElmIndex].n.push({e:$Elm,n:i});
            });
            //
            // sort
            loop(aElements, function(oParent) { oParent.s.sort(fnSort); });
            //
            // order elements and fill new order
            loop(aElements, function(oParent) {
                var aSorted = oParent.s
                    ,aUnsorted = oParent.n
                    ,iSorted = aSorted.length
                    ,iUnsorted = aUnsorted.length
                    ,iNumElm = iSorted+iUnsorted
                    ,aOriginal = [] // list for original position
                    ,iLow = iNumElm
                    ,aCount = [0,0] // count how much we've sorted for retrieval from either the sort list or the non-sort list (oParent.s/oParent.n)
                ;
                switch (oSettings.place) {
                    case 'first':   loop(aSorted,function(obj) { iLow = mathmn(iLow,obj.n); }); break;
                    case 'org':     loop(aSorted,function(obj) { aOriginal.push(obj.n); }); break;
                    case 'end':     iLow = iUnsorted; break;
                    default:        iLow = 0;
                }
                for (i=0;i<iNumElm;i++) {
                    var bFromSortList = contains(aOriginal,i)?!fls:i>=iLow&&i<iLow+iSorted
                        ,iCountIndex = bFromSortList?0:1
                        ,mEl = (bFromSortList?aSorted:aUnsorted)[aCount[iCountIndex]].e;
                    mEl.parent().append(mEl);
                    if (bFromSortList||!oSettings.returns) aNewOrder.push(mEl.get(0));
                    aCount[iCountIndex]++;
                }
            });
            oThis.length = 0;
            Array.prototype.push.apply(oThis,aNewOrder);
            return oThis;
        }
    });
    // toLowerCase // todo: dismantle, used only once
    function toLowerCase(s) {
        return s&&s.toLowerCase?s.toLowerCase():s;
    }
    // array contains
    function contains(a,n) {
        for (var i=0,l=a.length;i<l;i++) if (a[i]==n) return !fls;
        return fls;
    }
    // set functions
    $.fn.TinySort = $.fn.Tinysort = $.fn.tsort = $.fn.tinysort;
})(jQuery);


/*

$.Link (part of noUiSlider) - WTFPL */
(function(c){function m(a,c,d){if((a[c]||a[d])&&a[c]===a[d])throw Error("(Link) '"+c+"' can't match '"+d+"'.'");}function r(a){void 0===a&&(a={});if("object"!==typeof a)throw Error("(Format) 'format' option must be an object.");var h={};c(u).each(function(c,n){if(void 0===a[n])h[n]=A[c];else if(typeof a[n]===typeof A[c]){if("decimals"===n&&(0>a[n]||7<a[n]))throw Error("(Format) 'format.decimals' option must be between 0 and 7.");h[n]=a[n]}else throw Error("(Format) 'format."+n+"' must be a "+typeof A[c]+
".");});m(h,"mark","thousand");m(h,"prefix","negative");m(h,"prefix","negativeBefore");this.r=h}function k(a,h){"object"!==typeof a&&c.error("(Link) Initialize with an object.");return new k.prototype.p(a.target||function(){},a.method,a.format||{},h)}var u="decimals mark thousand prefix postfix encoder decoder negative negativeBefore to from".split(" "),A=[2,".","","","",function(a){return a},function(a){return a},"-","",function(a){return a},function(a){return a}];r.prototype.a=function(a){return this.r[a]};
r.prototype.L=function(a){function c(a){return a.split("").reverse().join("")}a=this.a("encoder")(a);var d=this.a("decimals"),n="",k="",m="",r="";0===parseFloat(a.toFixed(d))&&(a="0");0>a&&(n=this.a("negative"),k=this.a("negativeBefore"));a=Math.abs(a).toFixed(d).toString();a=a.split(".");this.a("thousand")?(m=c(a[0]).match(/.{1,3}/g),m=c(m.join(c(this.a("thousand"))))):m=a[0];this.a("mark")&&1<a.length&&(r=this.a("mark")+a[1]);return this.a("to")(k+this.a("prefix")+n+m+r+this.a("postfix"))};r.prototype.w=
function(a){function c(a){return a.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g,"\\$&")}var d;if(null===a||void 0===a)return!1;a=this.a("from")(a);a=a.toString();d=a.replace(RegExp("^"+c(this.a("negativeBefore"))),"");a!==d?(a=d,d="-"):d="";a=a.replace(RegExp("^"+c(this.a("prefix"))),"");this.a("negative")&&(d="",a=a.replace(RegExp("^"+c(this.a("negative"))),"-"));a=a.replace(RegExp(c(this.a("postfix"))+"$"),"").replace(RegExp(c(this.a("thousand")),"g"),"").replace(this.a("mark"),".");a=this.a("decoder")(parseFloat(d+
a));return isNaN(a)?!1:a};k.prototype.K=function(a,h){this.method=h||"html";this.j=c(a.replace("-tooltip-","")||"<div/>")[0]};k.prototype.H=function(a){this.method="val";this.j=document.createElement("input");this.j.name=a;this.j.type="hidden"};k.prototype.G=function(a){function h(a,c){return[c?null:a,c?a:null]}var d=this;this.method="val";this.target=a.on("change",function(a){d.B.val(h(c(a.target).val(),d.t),{link:d,set:!0})})};k.prototype.p=function(a,h,d,k){this.g=d;this.update=!k;if("string"===
typeof a&&0===a.indexOf("-tooltip-"))this.K(a,h);else if("string"===typeof a&&0!==a.indexOf("-"))this.H(a);else if("function"===typeof a)this.target=!1,this.method=a;else{if(a instanceof c||c.zepto&&c.zepto.isZ(a)){if(!h){if(a.is("input, select, textarea")){this.G(a);return}h="html"}if("function"===typeof h||"string"===typeof h&&a[h]){this.method=h;this.target=a;return}}throw new RangeError("(Link) Invalid Link.");}};k.prototype.write=function(a,c,d,k){if(!this.update||!1!==k)if(this.u=a,this.F=a=
this.format(a),"function"===typeof this.method)this.method.call(this.target[0]||d[0],a,c,d);else this.target[this.method](a,c,d)};k.prototype.q=function(a){this.g=new r(c.extend({},a,this.g instanceof r?this.g.r:this.g))};k.prototype.J=function(a){this.B=a};k.prototype.I=function(a){this.t=a};k.prototype.format=function(a){return this.g.L(a)};k.prototype.A=function(a){return this.g.w(a)};k.prototype.p.prototype=k.prototype;c.Link=k})(window.jQuery||window.Zepto);/*

$.fn.noUiSlider - WTFPL - refreshless.com/nouislider/ */
(function(c){function m(e){return"number"===typeof e&&!isNaN(e)&&isFinite(e)}function r(e){return c.isArray(e)?e:[e]}function k(e,b){e.addClass(b);setTimeout(function(){e.removeClass(b)},300)}function u(e,b){return 100*b/(e[1]-e[0])}function A(e,b){if(b>=e.d.slice(-1)[0])return 100;for(var a=1,c,f,d;b>=e.d[a];)a++;c=e.d[a-1];f=e.d[a];d=e.c[a-1];c=[c,f];return d+u(c,0>c[0]?b+Math.abs(c[0]):b-c[0])/(100/(e.c[a]-d))}function a(e,b){if(100<=b)return e.d.slice(-1)[0];for(var a=1,c,f,d;b>=e.c[a];)a++;c=
e.d[a-1];f=e.d[a];d=e.c[a-1];c=[c,f];return 100/(e.c[a]-d)*(b-d)*(c[1]-c[0])/100+c[0]}function h(a,b){for(var c=1,g;(a.dir?100-b:b)>=a.c[c];)c++;if(a.m)return g=a.c[c-1],c=a.c[c],b-g>(c-g)/2?c:g;a.h[c-1]?(g=a.h[c-1],c=a.c[c-1]+Math.round((b-a.c[c-1])/g)*g):c=b;return c}function d(a,b){if(!m(b))throw Error("noUiSlider: 'step' is not numeric.");a.h[0]=b}function n(a,b){if("object"!==typeof b||c.isArray(b))throw Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
c.each(b,function(b,g){var d;"number"===typeof g&&(g=[g]);if(!c.isArray(g))throw Error("noUiSlider: 'range' contains invalid value.");d="min"===b?0:"max"===b?100:parseFloat(b);if(!m(d)||!m(g[0]))throw Error("noUiSlider: 'range' value isn't numeric.");a.c.push(d);a.d.push(g[0]);d?a.h.push(isNaN(g[1])?!1:g[1]):isNaN(g[1])||(a.h[0]=g[1])});c.each(a.h,function(b,c){if(!c)return!0;a.h[b]=u([a.d[b],a.d[b+1]],c)/(100/(a.c[b+1]-a.c[b]))})}function E(a,b){"number"===typeof b&&(b=[b]);if(!c.isArray(b)||!b.length||
2<b.length)throw Error("noUiSlider: 'start' option is incorrect.");a.b=b.length;a.start=b}function I(a,b){a.m=b;if("boolean"!==typeof b)throw Error("noUiSlider: 'snap' option must be a boolean.");}function J(a,b){if("lower"===b&&1===a.b)a.i=1;else if("upper"===b&&1===a.b)a.i=2;else if(!0===b&&2===a.b)a.i=3;else if(!1===b)a.i=0;else throw Error("noUiSlider: 'connect' option doesn't match handle count.");}function D(a,b){switch(b){case "horizontal":a.k=0;break;case "vertical":a.k=1;break;default:throw Error("noUiSlider: 'orientation' option is invalid.");
}}function K(a,b){if(2<a.c.length)throw Error("noUiSlider: 'margin' option is only supported on linear sliders.");a.margin=u(a.d,b);if(!m(b))throw Error("noUiSlider: 'margin' option must be numeric.");}function L(a,b){switch(b){case "ltr":a.dir=0;break;case "rtl":a.dir=1;a.i=[0,2,1,3][a.i];break;default:throw Error("noUiSlider: 'direction' option was not recognized.");}}function M(a,b){if("string"!==typeof b)throw Error("noUiSlider: 'behaviour' must be a string containing options.");var c=0<=b.indexOf("snap");
a.n={s:0<=b.indexOf("tap")||c,extend:0<=b.indexOf("extend"),v:0<=b.indexOf("drag"),fixed:0<=b.indexOf("fixed"),m:c}}function N(a,b,d){a.o=[b.lower,b.upper];a.g=b.format;c.each(a.o,function(a,e){if(!c.isArray(e))throw Error("noUiSlider: 'serialization."+(a?"upper":"lower")+"' must be an array.");c.each(e,function(){if(!(this instanceof c.Link))throw Error("noUiSlider: 'serialization."+(a?"upper":"lower")+"' can only contain Link instances.");this.I(a);this.J(d);this.q(b.format)})});a.dir&&1<a.b&&a.o.reverse()}
function O(a,b){var f={c:[],d:[],h:[!1],margin:0},g;g={step:{e:!1,f:d},start:{e:!0,f:E},connect:{e:!0,f:J},direction:{e:!0,f:L},range:{e:!0,f:n},snap:{e:!1,f:I},orientation:{e:!1,f:D},margin:{e:!1,f:K},behaviour:{e:!0,f:M},serialization:{e:!0,f:N}};a=c.extend({connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal"},a);a.serialization=c.extend({lower:[],upper:[],format:{}},a.serialization);c.each(g,function(c,d){if(void 0===a[c]){if(d.e)throw Error("noUiSlider: '"+c+"' is required.");
return!0}d.f(f,a[c],b)});f.style=f.k?"top":"left";return f}function P(a,b){var d=c("<div><div/></div>").addClass(f[2]),g=["-lower","-upper"];a.dir&&g.reverse();d.children().addClass(f[3]+" "+f[3]+g[b]);return d}function Q(a,b){b.j&&(b=new c.Link({target:c(b.j).clone().appendTo(a),method:b.method,format:b.g},!0));return b}function R(a,b){var d,f=[];for(d=0;d<a.b;d++){var k=f,h=d,m=a.o[d],n=b[d].children(),r=a.g,s=void 0,v=[],s=new c.Link({},!0);s.q(r);v.push(s);for(s=0;s<m.length;s++)v.push(Q(n,m[s]));
k[h]=v}return f}function S(a,b,c){switch(a){case 1:b.addClass(f[7]);c[0].addClass(f[6]);break;case 3:c[1].addClass(f[6]);case 2:c[0].addClass(f[7]);case 0:b.addClass(f[6])}}function T(a,b){var c,d=[];for(c=0;c<a.b;c++)d.push(P(a,c).appendTo(b));return d}function U(a,b){b.addClass([f[0],f[8+a.dir],f[4+a.k]].join(" "));return c("<div/>").appendTo(b).addClass(f[1])}function V(d,b,m){function g(){return t[["width","height"][b.k]]()}function n(a){var b,c=[q.val()];for(b=0;b<a.length;b++)q.trigger(a[b],
c)}function u(d,p,e){var g=d[0]!==l[0][0]?1:0,H=x[0]+b.margin,k=x[1]-b.margin;e&&1<l.length&&(p=g?Math.max(p,H):Math.min(p,k));100>p&&(p=h(b,p));p=Math.max(Math.min(parseFloat(p.toFixed(7)),100),0);if(p===x[g])return 1===l.length?!1:p===H||p===k?0:!1;d.css(b.style,p+"%");d.is(":first-child")&&d.toggleClass(f[17],50<p);x[g]=p;b.dir&&(p=100-p);c(y[g]).each(function(){this.write(a(b,p),d.children(),q)});return!0}function B(a,b,c){c||k(q,f[14]);u(a,b,!1);n(["slide","set","change"])}function w(a,c,d,e){a=
a.replace(/\s/g,".nui ")+".nui";c.on(a,function(a){var c=q.attr("disabled");if(q.hasClass(f[14])||void 0!==c&&null!==c)return!1;a.preventDefault();var c=0===a.type.indexOf("touch"),p=0===a.type.indexOf("mouse"),F=0===a.type.indexOf("pointer"),g,k,l=a;0===a.type.indexOf("MSPointer")&&(F=!0);a.originalEvent&&(a=a.originalEvent);c&&(g=a.changedTouches[0].pageX,k=a.changedTouches[0].pageY);if(p||F)F||void 0!==window.pageXOffset||(window.pageXOffset=document.documentElement.scrollLeft,window.pageYOffset=
document.documentElement.scrollTop),g=a.clientX+window.pageXOffset,k=a.clientY+window.pageYOffset;l.C=[g,k];l.cursor=p;a=l;a.l=a.C[b.k];d(a,e)})}function C(a,c){var b=c.b||l,d,e=!1,e=100*(a.l-c.start)/g(),f=b[0][0]!==l[0][0]?1:0;var k=c.D;d=e+k[0];e+=k[1];1<b.length?(0>d&&(e+=Math.abs(d)),100<e&&(d-=e-100),d=[Math.max(Math.min(d,100),0),Math.max(Math.min(e,100),0)]):d=[d,e];e=u(b[0],d[f],1===b.length);1<b.length&&(e=u(b[1],d[f?0:1],!1)||e);e&&n(["slide"])}function s(a){c("."+f[15]).removeClass(f[15]);
a.cursor&&c("body").css("cursor","").off(".nui");G.off(".nui");q.removeClass(f[12]);n(["set","change"])}function v(a,b){1===b.b.length&&b.b[0].children().addClass(f[15]);a.stopPropagation();w(z.move,G,C,{start:a.l,b:b.b,D:[x[0],x[l.length-1]]});w(z.end,G,s,null);a.cursor&&(c("body").css("cursor",c(a.target).css("cursor")),1<l.length&&q.addClass(f[12]),c("body").on("selectstart.nui",!1))}function D(a){var d=a.l,e=0;a.stopPropagation();c.each(l,function(){e+=this.offset()[b.style]});e=d<e/2||1===l.length?
0:1;d-=t.offset()[b.style];d=100*d/g();B(l[e],d,b.n.m);b.n.m&&v(a,{b:[l[e]]})}function E(a){var c=(a=a.l<t.offset()[b.style])?0:100;a=a?0:l.length-1;B(l[a],c,!1)}var q=c(d),x=[-1,-1],t,y,l;if(q.hasClass(f[0]))throw Error("Slider was already initialized.");t=U(b,q);l=T(b,t);y=R(b,l);S(b.i,q,l);(function(a){var b;if(!a.fixed)for(b=0;b<l.length;b++)w(z.start,l[b].children(),v,{b:[l[b]]});a.s&&w(z.start,t,D,{b:l});a.extend&&(q.addClass(f[16]),a.s&&w(z.start,q,E,{b:l}));a.v&&(b=t.find("."+f[7]).addClass(f[10]),
a.fixed&&(b=b.add(t.children().not(b).children())),w(z.start,b,v,{b:l}))})(b.n);d.vSet=function(){var a=Array.prototype.slice.call(arguments,0),d,e,g,h,m,s,t=r(a[0]);"object"===typeof a[1]?(d=a[1].set,e=a[1].link,g=a[1].update,h=a[1].animate):!0===a[1]&&(d=!0);b.dir&&1<b.b&&t.reverse();h&&k(q,f[14]);a=1<l.length?3:1;1===t.length&&(a=1);for(m=0;m<a;m++)h=e||y[m%2][0],h=h.A(t[m%2]),!1!==h&&(h=A(b,h),b.dir&&(h=100-h),!0!==u(l[m%2],h,!0)&&c(y[m%2]).each(function(a){if(!a)return s=this.u,!0;this.write(s,
l[m%2].children(),q,g)}));!0===d&&n(["set"]);return this};d.vGet=function(){var a,c=[];for(a=0;a<b.b;a++)c[a]=y[a][0].F;return 1===c.length?c[0]:b.dir?c.reverse():c};d.destroy=function(){c.each(y,function(){c.each(this,function(){this.target&&this.target.off(".nui")})});c(this).off(".nui").removeClass(f.join(" ")).empty();return m};q.val(b.start)}function W(a){if(!this.length)throw Error("noUiSlider: Can't initialize slider on empty selection.");var b=O(a,this);return this.each(function(){V(this,
b,a)})}function X(a){return this.each(function(){var b=c(this).val(),d=this.destroy(),f=c.extend({},d,a);c(this).noUiSlider(f);d.start===f.start&&c(this).val(b)})}function B(){return this[0][arguments.length?"vSet":"vGet"].apply(this[0],arguments)}var G=c(document),C=c.fn.val,z=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",
end:"mouseup touchend"},f="noUi-target noUi-base noUi-origin noUi-handle noUi-horizontal noUi-vertical noUi-background noUi-connect noUi-ltr noUi-rtl noUi-dragable  noUi-state-drag  noUi-state-tap noUi-active noUi-extended noUi-stacking".split(" ");c.fn.val=function(){var a=arguments,b=c(this[0]);return arguments.length?this.each(function(){(c(this).hasClass(f[0])?B:C).apply(c(this),a)}):(b.hasClass(f[0])?B:C).call(b)};c.noUiSlider={Link:c.Link};c.fn.noUiSlider=function(a,b){return(b?X:W).call(this,
a)}})(window.jQuery||window.Zepto);

