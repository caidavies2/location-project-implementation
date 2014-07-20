<!-- $title NearBy - Find the best restaurants, coffee houses and bars
near to your specific location in an instant -->
<!-- @include _header_map -->
<?php

$lat = $_GET["lat"];
$lng = $_GET["lng"];
$street = $_GET["street"];
// echo $street;
?>

<script type="text/javascript">
    var lat = "<?php echo $lat; ?>";
    var lng = "<?php echo $lng; ?>";
    var street = "<?php echo $street; ?>";
   var map;

// function initialize() {
//         var mapOptions = {
//           center: new google.maps.LatLng(lat, lng),
//           zoom: 17,
//           panControl: false,

//           zoomControlOptions: {
//             position: google.maps.ControlPosition.TOP_RIGHT
//           }
//         };
//         var map = new google.maps.Map(document.getElementById("map"),
//             mapOptions);
//       }
//       google.maps.event.addDomListener(window, 'load', initialize);
</script>
<div id="loading">
</div>
<header class="header-map">
<div class="header-container">
<h1>NearBy</h1>

<!-- <div class="map-cta">		
		<input type="text" class="location" placeholder="Type street name or postcode...">
		<button id="submit">Search</button>
	</div> -->
</div>
</header>

<div class="map-main-container clearfix">

<section class="results">
<section class="results-inner">

<ul class="venue-items clearfix">


</ul>

</section>
</section>

<section id="map">

</section>

</div>


<!-- @include _footer_map -->


