var items = new Array();
var marker = new Array();  
var itemString;
var fullItemString = '';
var radius = 1000;
var venueType = "restaurant";
// var city = street;
$(document).ready(function(){
  
//   $(".distance-slider").noUiSlider({
//   start: 40,
//   range: {
//     'min': 0,
//     'max': 100
//   }
// });

  changeTextBox();
  getVenues(lat,lng,"restaurant",radius);

  $('.venue-controllers button').click(function(){

      var id = $(this).attr("id");

      if(id == "restaurant")
      {
        $('#restaurant').removeClass("inactive").addClass("active");
        $('#coffee').removeClass("active").addClass("inactive");
        getVenues(lat,lng,id, radius);
      }

      else if(id == "coffee")
      {
        $('#coffee').removeClass("inactive").addClass("active");
        $('#restaurant').removeClass("active").addClass("inactive");
        getVenues(lat,lng,id, radius);
      }

  });

  $(".location").geocomplete();

  $('.location').keypress(function (e) {
  if (e.which == 13) {
    $('#submit').click();
  }
});

$("#submit").click(function(){
  var address = $('.location').val();
   var geocoder = new google.maps.Geocoder();
      if (geocoder) {
         geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {  
              lat = results[0].geometry.location.k;
              lng = results[0].geometry.location.B;
          
          console.log(lat,lng)            

          getVenues(lat,lng,venueType,radius);

            } 
            else {
              console.log('No results found: ' + status);
            }
         });
      }

});

});



function getVenues(latitude, longitude, venueType, radius)
{
  $('.results').fadeTo('fast', 0.2);
  $('#map').fadeTo('fast', 0.2);
  resetStrings();
  $.getJSON('https://api.foursquare.com/v2/venues/explore?client_id=W3BDCS3X5UJM4LOU23B11OFFREDRJERTITLVCGNX1BASQXD3&client_secret=NQX4QLCGUXYRX5GTPKJQCWYZQWTP5ZIYNINMJPVSGO3ZLWCP%20&v=20130815%20&venuePhotos=1&ll=' + lat + ',' + lng + '%20&query=' + venueType + '&radius=' + radius + '&sortbyrating=10',
    function(data) {      
      console.log(data.response.groups[0]);
      for (var i = 0; i <9; i++)
      {        
        try
        { 
          var iUrl = data.response.groups[0].items[i].venue.rating;
          items[i]=
          [
          {
            'id': data.response.groups[0].items[i].venue.id,                   
            'name': data.response.groups[0].items[i].venue.name,
            'description': data.response.groups[0].items[i].tips[0].text,  
            'rating': iUrl,       
            'price': data.response.groups[0].items[i].venue.price.tier,
            'lat': data.response.groups[0].items[i].venue.location.lat,
            'lng': data.response.groups[0].items[i].venue.location.lng,
            'url': data.response.groups[0].items[i].venue.url,
            'picture': data.response.groups[0].items[i].venue.photos.groups[0].items[0].prefix + "220x220" + data.response.groups[0].items[i].venue.photos.groups[0].items[0].suffix         
          }        
          ]              
        }
        catch(e){
          if(e){
            noResults();
            return;
          }
        }

        if(items[i][0].rating == undefined)
        {
          items[i][0].rating = 0;
        }

        else if(items[i][0].url == undefined)
        {
          items[i][0].url = '';
        }
        createString(i);
// End of FOR Loop.
}

// End of AJAX Call
})
.done(function() {
  if(items.length == 0)
  {
    console.log("no results");
  }
  $('.venue-items').empty();
  $($.parseHTML(fullItemString)).appendTo('.venue-items');
  $('.venue-items>li').tsort({attr:'data-rating'});
  function initialize() {
    var mapOptions = {

      center: new google.maps.LatLng(lat, lng),
      zoom: 17,
      styles: [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},{'featureType':'landscape','stylers':[{'color':'#f2e5d4'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}],
      animation: google.maps.Animation.DROP,
      panControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    };
    var image = {
    url: '../img/map/marker.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(40, 50),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 32)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);
    var bounds = new google.maps.LatLngBounds();
    for(var iMarkCount = 0; iMarkCount < items.length; iMarkCount++)
    {
    var location = new google.maps.LatLng(items[iMarkCount][0].lat, items[iMarkCount][0].lng);
    bounds.extend(location);
    marker = new google.maps.Marker({
      position: location,
      map: map,
      // icon: image,
      visible: true
    });        
    }
    map.fitBounds(bounds);
    console.log(bounds);
  }
  initialize();

  $('.results').fadeTo('fast', 1);
  $('#map').fadeTo('fast', 1);

});

}

function createString(i)
{
  itemString = "<li rating= '"+items[i][0].rating + "'class='clearfix'><img class='venue-image' src='"+items[i][0].picture+"' width='110' height='110'><article class='venue-description'><h1>"+items[i][0].name+"</h1><p>"+items[i][0].description+"</p></article><span class='venue-rating'>"+items[i][0].rating+"</span><a target='new' class='venue-website' href='"+items[i][0].url+"'>" + items[i][0].url+ "</a></li>";
  fullItemString = fullItemString + itemString;
  return;
}

function changeTextBox()
{
  $('.location').val(street);
  return;
}

function noResults()
{
  fullItemString = '';
  $('.venue-items').empty();
  $('.results-error').text("<p>Hello World</p>");
  fadeInContent();
  return;
}

function fadeInContent()
{
  $('.results').fadeTo('fast', 1);
  $('#map').fadeTo('fast', 1);
  return;
}

function resetStrings()
{
  fullItemString = "";
  itemString = "";
  return;
}