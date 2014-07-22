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

<div class="map-main-container clearfix" style="height=100%;">

<section class="results">
<section class="results-inner">
	<span class="results-error">
	<span>

<ul class="venue-items clearfix">


</ul>

</section>
</section>
<div class="venue-controllers">
<!-- <div class="distance-slider">

</div> -->
<button id="restaurant" class="active" data-icon="&#xe026;">
	<span>Food</span>
</button>

<button id="coffee" class="inactive" data-icon="&#xe016;">
	<span>Coffee</span>
</button>


</div>

<section id="map">
</section>

</div>


<!-- @include _footer_map -->


