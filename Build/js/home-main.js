$(document).ready(function(){
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

         	window.location = "map/index.php?lat=" + lat + "&lng=" + lng + "&street=" + address;

            } 
            else {
              console.log('No results found: ' + status);
            }
         });
      }

});
});