<!-- $title NearBy - Find the best restaurants, coffee houses and bars
near to your specific location in an instant -->
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>My Default Title</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
        <script type="text/javascript" src="//use.typekit.net/ouv1agu.js"></script>
        <script type="text/javascript">try{Typekit.load();}catch(e){}</script>
        <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB1AC1r3RvRWDB5ihm1bhlIjvIEzYAdcnA">
    </script>
    <script src="http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
        
        <script>
//         var map;

// function initialize() {
//         var mapOptions = {
//           center: new google.maps.LatLng(50.375456, -4.142656),
//           zoom: 8,
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
        
        <!-- Hammer reload -->
          <script>
            setInterval(function(){
              try {
                if(typeof ws != 'undefined' && ws.readyState == 1){return true;}
                ws = new WebSocket('ws://'+(location.host || 'localhost').split(':')[0]+':35353')
                ws.onopen = function(){ws.onclose = function(){document.location.reload()}}
                ws.onmessage = function(){
                  var links = document.getElementsByTagName('link'); 
                    for (var i = 0; i < links.length;i++) { 
                    var link = links[i]; 
                    if (link.rel === 'stylesheet' && !link.href.match(/typekit/)) { 
                      href = link.href.replace(/((&|\?)hammer=)[^&]+/,''); 
                      link.href = href + (href.indexOf('?')>=0?'&':'?') + 'hammer='+(new Date().valueOf());
                    }
                  }
                }
              }catch(e){}
            }, 1000)
          </script>
        <!-- /Hammer reload -->
      
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel='stylesheet' href='../css/normalize.css'>
<link rel='stylesheet' href='../css/main.css'>
        <script src='../js/vendor/modernizr-2.6.2.min.js'></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
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
    console.log(lat);
   console.log(lng);    
   console.log(street);
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
	<img class="venue-image" src="../img/map/venue-1.jpg" width="110" height="110">
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
	<img class="venue-image" src="../img/map/venue-1.jpg" width="110" height="110">
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






        <script src='../js/vendor/jquery-1.9.1.min.js'></script>
<script src='../js/plugins.js'></script>
<script src='../js/map-main.js'></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>