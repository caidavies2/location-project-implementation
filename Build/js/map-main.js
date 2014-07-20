var items = new Array();
var marker = new Array();  
var itemString;
var fullItemString = '';
var radius = 1000;
var venueType = "restaurant";
$(document).ready(function(){
  getVenues(lat,lng,"restaurant", "600");

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
  $('#loading').fadeIn('fast');
  $.getJSON('https://api.foursquare.com/v2/venues/explore?client_id=W3BDCS3X5UJM4LOU23B11OFFREDRJERTITLVCGNX1BASQXD3&client_secret=NQX4QLCGUXYRX5GTPKJQCWYZQWTP5ZIYNINMJPVSGO3ZLWCP%20&v=20130815%20&venuePhotos=1&ll=' + lat + ',' + lng + '%20&query=' + venueType + '&radius=' + radius,
    function(data) {      
      console.log(data.response.groups[0]);
      for (var i = 0; i <9; i++)
      {
        try
        { 
          items[i]=
          [
          {
            'id': data.response.groups[0].items[i].venue.id,                   
            'name': data.response.groups[0].items[i].venue.name,
            'description': data.response.groups[0].items[i].tips[0].text,  
            'rating': data.response.groups[0].items[i].venue.rating,       
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
            console.log("error");
          }
        }
        if(items[i][0].rating == undefined)
        {
          items[i][0].rating = 0;
          return;
        }
        createString(i);
// End of FOR Loop.
}

// End of AJAX Call
})
.done(function() {
  $($.parseHTML(fullItemString)).appendTo('.venue-items');
  
  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 17,
      panControl: false,

      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);
    for(var iMarkCount = 0; iMarkCount < items.length; iMarkCount++)
    {
    var location = new google.maps.LatLng(items[iMarkCount][0].lat, items[iMarkCount][0].lng);
    console.log(location);
    marker = new google.maps.Marker({
      position: location,
      map: map,
      visible: true
    });        
    }

  }
  initialize();



  $('#loading').fadeOut('fast');

});

}

function createString(i)
{
  itemString = "<li class='clearfix'><img class='venue-image' src='"+items[i][0].picture+"' width='110' height='110'><article class='venue-description'><h1>"+items[i][0].name+"</h1><p>"+items[i][0].description+"</p></article><span rating= '" + +items[i][0].rating + "' class='venue-rating'>"+items[i][0].rating+"</span><a class='venue-website' href='"+items[i][0].url+"'>" + items[i][0].url+ "</a></li>";
  fullItemString = fullItemString + itemString;
}