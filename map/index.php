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
      }
      google.maps.event.addDomListener(window, 'load', initialize);
</script>

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

<li class="clearfix">
	<img class="venue-image" src="<!-- @path venue-1.jpg -->" width="110" height="110">
	<article class="venue-description">
		<h1>Jacob's Pickles</h1>
		<p>
		Celeste is a cash only family-owned Italian restaurant where the pasta is made fresh daily. The chef goes to Italy every month to hand-pick several local and hard-to-come-by cheeses.
		</p>
	</article>
	<span class="venue-rating">
			9.5
		</span>

	<a class="venue-website" href="www.jacobspickles.com">www.jacobspickles.com</a>
</li>

<li class="clearfix">
	<img class="venue-image" src="<!-- @path venue-1.jpg -->" width="110" height="110">
	<article class="venue-description">
		<h1>Jacob's Pickles</h1>
		<p>
		Celeste is a cash only family-owned Italian restaurant where the pasta is made fresh daily. The chef goes to Italy every month to hand-pick several local and hard-to-come-by cheeses.
		</p>
	</article>
	<span class="venue-rating">
			9.5
		</span>

	<a class="venue-website" href="www.jacobspickles.com">www.jacobspickles.com</a>
</li>

</ul>

</section>
</section>

<section id="map">

</section>

</div>






<!-- @include _footer_map -->


