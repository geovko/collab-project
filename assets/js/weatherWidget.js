//Document Element Targetting and Dynamically Generated HTML for the popup Modal and Weather Widget

document.addEventListener('DOMContentLoaded', function () { weatherWidget
    const popupModal2 =  
        document.getElementById('popupModal2'); 
    const closeModal2 =  
        document.getElementById('closeModal2'); 
    const postContainer =  
        document.querySelector('.weatherDetailsContainer'); 

        weatherWidget.addEventListener('click', function () { 
        popupModal2.style.display = 'flex'; 
    }); 
  
    closeModal2.addEventListener('click', function () { 
        popupModal2.classList.add('fadeOut'); 
        setTimeout(() => { 
            popupModal2.style.display = 'none'; 
            popupModal2.classList.remove('fadeOut'); 
        }, 500); 
    }); 
}); 

let whateverTheUserTypesInAsTheirDestination = 'Irvine' //change Irvine to the LOCATION VARIABLE that users enter into the "Destination" Field on the form
let yourWeatherLocation = whateverTheUserTypesInAsTheirDestination
window.weatherWidgetConfig =  window.weatherWidgetConfig || [];
window.weatherWidgetConfig.push({
    selector:".weatherWidget",
    apiKey:"AA89H5V6JGJCWZQ38G6MLE4B2", 
    location: yourWeatherLocation,
    unitGroup:"us", 
    forecastDays:5, 
    title:"SkyWatch Weather", 
    showTitle:true, 
    showConditions:true
});


//Weather API and Off-Site Widget Style Sheet Information provided by Visual Crossing: https://www.visualcrossing.com/ "weather-api" and "weatherwidgets"
(function() {
var d = document, s = d.createElement('script');
(function(global) {
 "use strict";

var WeatherForecastWidget=function(initConfig) {

     this.rawSelector=initConfig.selector;
     if ((!initConfig.location) && localStorage) {
         initConfig.location=localStorage.getItem("loc");
     }
     if (!initConfig.location) initConfig.location="_auto_";

     this.config={
         "location":initConfig.location, //initial location
         "title":initConfig.title || (initConfig.location!=="_auto_" && initConfig.location),
         "unitGroup":initConfig.unitGroup || "us", //initial location
         "key":initConfig.apiKey, //api key
         "hourly":false,
         "forecastDays":initConfig.forecastDays || 5, 
         "showTitle":!(initConfig.showTitle===false), 
         "showCurrent":!(initConfig.showCurrent===false)
     }

     this.dailydata=null;
     this.hourlydata=null;
     this.error=null;
     var me=this;

     this.setLocation=function(location) {
         if (!location) location="_auto_";
         me.config.location=location;
         me.dailydata=null;
         me.hourlydata=null;
         me.loadForecastData();
     }
   
     this.init=function(stylesheets) {

         if (!stylesheets || stylesheets.length==0) {
             me.loadForecastData();
             return;
         }
         var link = document.createElement( 'link' );
         link.rel  = 'stylesheet';
         link.href = stylesheets.pop();

         document.head.appendChild( link );
         link.onload = function() { 
            me.init(stylesheets);
         };
     }

     this.loadForecastData=function() {

         if ( me.error) return;
         if ((me.config.hourly && me.hourlydata) || (!me.config.hourly && me.dailydata)) return;
         var uri=(initConfig.root || "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/");
         uri+='forecast?';
         uri+="unitGroup="+me.config.unitGroup+"&contentType=json&locationMode=single&iconSet=icons1&location="+me.config.location+"&key="+me.config.key;
         uri+="&aggregateHours=12"
         var request = new XMLHttpRequest();
         request.open('GET', uri, true);
         request.onload = function() {
         if (this.status >= 200 && this.status < 400) {
             var rawResult = JSON.parse(this.response);
             me.dailydata=rawResult;
             if (!rawResult || rawResult.errorCode) {
                 me.showError("Error loading data", rawResult.message);
                 if (rawResult) console.log("Error loading data (1):"+rawResult.message);
                 return;
             }

             me.processValues(rawResult);
             if (me.config.hourly) {
                 me.hourlydata=rawResult;
             } else {
                 me.dailydata=rawResult;
             }
              me.refresh();
         } else {
         }
         };
         request.onerror = function() {
         };
         request.send();
     }

     this.processValues=function(data) {
         var forecastValues=me.getForecastValues(data);
         if (!forecastValues) return;
         var current=new Date();
         var offset=current.getTimezoneOffset()*60000;
         forecastValues.forEach(function(d) {
             d.datetime=new Date(d.datetime+offset );
         });
     }
     this.getForecastValues=function(data) {
         if (!data) {
            throw "No data available for "+me.config.location;
         }
         var location=data.location;
         if (!location) {
             throw "No locations found in data for "+me.config.location;
         }
         if (location.address) {
             if (localStorage) localStorage.setItem("loc", location.address);
             me.config.location=location.address;
         }
         var forecastValues=location.values;
         forecastValues=forecastValues.filter(function(d) {
             return d && (d.temp || d.temp===0);
         });
         return forecastValues;
     }

     this.refresh=function() {
         me.loadForecastData();
         var root=document.querySelector(me.rawSelector);
          me.setHtml(root,null, "<div class='visualcrossing-wx-widget'>"+
          "<div class='title'></div>"+
          "<div class='content'>"+
              "<div class='current'>"+
                  "<i class='icon wi'></i>"+
                  "<div class='summary'>"+
                      "<div class='temp'>-</div>"+
                  "</div>"+
              "</div>"+
              "<div class='forecast'></div>"+
          "</div>"+
         "<a class='credit' href='https://www.visualcrossing.com/weather-api' title='Visual Crossing Weather Data' target='_blank'>SkyWatch Weather Forecast for your selected Destination</a>"+
         "</div>");

         var location=me.dailydata.location;
         var currentConditions=location.currentConditions;
         var widgetElement=root.querySelector(".visualcrossing-wx-widget");

         if (me.config.showTitle) {
             me.setHtml(widgetElement, ".title", me.config.title || location.address);
         } else {
             me.toggleClass(widgetElement, ".title","hidden");
         }
         if (me.config.showCurrent) {   
             if (currentConditions) {
                 me.toggleClass(widgetElement, ".current .icon","wi-forecast-io-"+currentConditions.icon);

                 var current=widgetElement.querySelector(".current .summary");
                 me.setHtml(current, ".temp", me.formatTemp(currentConditions.temp, true));
                 me.setHtml(current, ".precip", currentConditions.precip);
             }
         } else {
             me.toggleClass(widgetElement, ".current","hidden");
         }

         var values=location.values;
         var maxValues=me.config.forecastDays*2;
         var forecast=widgetElement.querySelector(".forecast");
        
         for (var i=0;i<values.length;i++) {
             var d=values[i];
             var nextd=(i<values.length-1)?values[i+1]:null;
             if (maxValues && i>=maxValues) break;
             var formattedDate= me.formatDate(d);
             var nextformattedDate=nextd && me.formatDate(nextd);
             forecast.insertAdjacentHTML('beforeend', "<div class='period'>"+
             "<div class='date'></div>"+
             "<i class='wi icon'></i>"+
             "<div class='maxt'></div>"+
             "</div>");
             var periodElement=forecast.lastElementChild;
             var collapseNext=false;
             var isDay=false;
             if (nextd && nextformattedDate===formattedDate) {
                 isDay=true;
                 collapseNext=true;
                 i++;
             }
             me.setHtml(periodElement, ".date", formattedDate);
             me.toggleClass(periodElement, ".icon","wi-forecast-io-"+d.icon);
             if (d.maxt) {
                me.setHtml(periodElement, ".maxt", me.formatTemp(d.maxt));
             } else {
                me.setHtml(periodElement, ".maxt", me.formatTemp(d.temp));
                
             }
         }  
     }
     this.getCompassDirection=function(degrees) {
         var wdir=Math.round(degrees/22.5);
         if (wdir<0) wdir+=16;
         if (wdir>15) wdir-=16;
         return ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][wdir];
     }
     this.formatTemp=function(value, showUnit) {
         if (!value && value!==0) return "-";
         value=Math.round(value);
         if (!showUnit) return value;
         return value+(me.config.unitGroup==="us"?"F":"C");
     }
     this.formatPrecip=function(value) {
         if (!value && value!==0) return "-";
         return value+(me.config.unitGroup==="us"?"\"":"mm");
     }
     this.formatDate=function(value) {
         var today=new Date();
         var date=new Date(value.datetime);
         if (today.getDate()===date.getDate()) return "Today";
         return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][ date.getDay()];
     }
     this.toggleClass=function(element, selector, className) {
         var el=element.querySelector(selector);
         el && (el.classList.toggle(className));
     }
     this.setHtml=function(element, selector, content) {
         element=selector?element.querySelector(selector):element;
         element && (element.innerHTML = content);   
     }
 }
 var attach=function(config) {
     var instance=new WeatherForecastWidget(config );
     instance.init(["https://www.visualcrossing.com/widgets/forecast-simple/weather-forecast-widget-simple.css","https://www.visualcrossing.com/widgets/forecast-simple/css/weather-icons.min.css"]);
     return instance;
 }
 if (!window.weatherWidgetConfig) {
     console.error("No weather widget configuration found!");
 } else {
     window.weatherWidgetConfig.forEach(function(config) {
         attach(config);
     })
 }
 global.WeatherForecastDisplay=WeatherForecastWidget;
})(this);
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();

document.addEventListener('DOMContentLoaded', function () {
    const weatherButton = document.getElementById('weatherWidget');
    const popupModal2 = document.getElementById('popupModal2');
    const closeModal2 = document.getElementById('closeModal2');

    weatherButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default action of the anchor tag
        popupModal2.style.display = 'flex';
    });

    closeModal2.addEventListener('click', function () {
        popupModal2.classList.add('fadeOut');
        setTimeout(() => {
            popupModal2.style.display = 'none';
            popupModal2.classList.remove('fadeOut');
        }, 500);
    });
});

