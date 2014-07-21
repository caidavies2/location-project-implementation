<!-- $title NearBy - Find the best restaurants, coffee houses and bars
near to your specific location in an instant -->
<!-- @include _header_map -->
<?php

$lat = $_GET["lat"];
$lng = $_GET["lng"];
$street = $_GET["street"];
?>

<script type="text/javascript">
    var lat = "<?php echo $lat; ?>";
    var lng = "<?php echo $lng; ?>";
    var street = "<?php echo $street; ?>";
    var map;

</script>
<header class="header-map">
<div class="header-container clearfix">
<h1>NearBy</h1>

<div class="map-cta">		
		<input type="text" class="location" placeholder="Type street name or postcode...">
		<button id="submit">Search</button>
	</div>
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


