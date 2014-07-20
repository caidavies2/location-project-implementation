var items = new Array();
    var marker = new Array();    
$(document).ready(function(){
getVenues(lat,lng,"restaurant", "5000");
});


function getVenues(latitude, longitude, venueType, radius)
{
$.getJSON('https://api.foursquare.com/v2/venues/explore?client_id=W3BDCS3X5UJM4LOU23B11OFFREDRJERTITLVCGNX1BASQXD3&client_secret=NQX4QLCGUXYRX5GTPKJQCWYZQWTP5ZIYNINMJPVSGO3ZLWCP%20&v=20130815%20&ll=' + lat + ',' + lng + '%20&query=' + venueType + '&radius=' + radius,
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
          'picture': ''          
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
        }
        getPictures(items[i][0].id, i); 
      }

      console.log(items);
// End of AJAX Call
});
    }

    function getPictures(id, count)
    {    
      $.getJSON('https://api.foursquare.com/v2/venues/' + id + "/photos?oauth_token=ASA3CFCX5KVZIGY2TATUOCBAKWAALTXSTSPGDPBD12T4M4VN&v=20140720",
      function(data) {
      var photoPrefix = data.response.photos.items[0].prefix;
      var photoSuffix = data.response.photos.items[0].suffix;
      var urlFull = photoPrefix.concat("220x220" + photoSuffix);
      items[count][0].picture = urlFull;
});

    }