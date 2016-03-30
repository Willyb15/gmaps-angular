var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function ($scope){
  $scope.markers = [];
  $scope.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    //geographical center of the US
    center: new google.maps.LatLng(40.0000, -98.0000)
  });
  
  infowindow = new google.maps.InfoWindow;
	
  function createMarker (city){
		var latLon = city.latLon.split(',');
		var lat = latLon[0];
		var lon = latLon[1];
		// passing object into some Google Maps predefined functions
    var marker = new google.maps.Marker(
    {
			map: $scope.map,
			position: new google.maps.LatLng(lat, lon),
			title: city.city,
      animation: google.maps.Animation.DROP 
    });
    // Create new html for "contentString", pulled from cities object, put into th InfoWindow
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '<h2>' + city.city + ", " + city.state + '</h2>'+
      '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>' +
      '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>' +
      '<div class="yearRank">US Population Rank: ' + city.yearRank + '</div>' +
      '<div class="pop-change">Population Change %: ' + city.change + '</div>' +
      '<div class="land-area">Land Area: ' + city.landArea + '</div>' +
      '<div class="land-areaInKM">Land Area Imperial: ' + city.landAreaInKm + '</div>' +
      '<div class="pop-dens">Population Density: ' + city.lastPopDensity + '</div>' +
      '<div class="directions"><a href="" onclick=getDirections('+lat+','+lon+');>Get Directions!</a></div>' +
      '</div>';

    marker.addListener('click', function(){
      infowindow.setContent(contentString)
      infowindow.open($scope.map, marker);
    });

  
    
    // Push markers into empty array($scope.markers[];) defined above
    $scope.markers.push(marker);
  }

  $scope.zoomTo = function(i){
      var latLon = cities[i].latLon.split(',');
      var newLat = Number(latLon[0]);
      var newLon = Number(latLon[1]);
  
    $scope.map.setCenter({
      lat : newLat,
      lng : newLon
    });

    $scope.map.setZoom(9);
  }

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap($scope.map);

  getDirections = function(lat, lon){   
       var request = {
         origin: 'Atlanta, GA', 
         destination:new google.maps.LatLng(lat,lon), 
         travelMode: google.maps.DirectionsTravelMode.DRIVING
       };
       directionsService.route(request, function(response, status) {
         if (status == google.maps.DirectionsStatus.OK) {
           directionsDisplay.setDirections(response);
         }
       }); 
      event.preventDefault();
  }
  

  

  // when you click on cityClick find the i-th element in markers
  $scope.cityClick = function(i){
    google.maps.event.trigger($scope.markers[i],'click');
  }

	$scope.cities = cities;
	for(i = 0; i< cities.length; i++){
		createMarker(cities[i])
	}
});
