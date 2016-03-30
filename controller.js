var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function ($scope){

       $scope.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          //geographical center of the US
          center: new google.maps.LatLng(40.0000, -98.0000)
        });


	function createMarker (city){
		var latLon = city.latLon.split(',');
		var lat = latLon[0];
		var lon = latLon[1];
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(lat, lon),
			title: city.city
		});

        var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '<h1>' + city.city + ", " + city.state + '</h1>' +
          '<div class="yearRank">US Population Rank: ' + city.yearRank + '</div>' +
          '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>' +
          '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>' +
          '<div class="pop-change">Population Change %: ' + city.change + '</div>' +
           '<div class="land-area">Land Area: ' + city.landArea + '</div>' +
          '<div class="land-areaInKM">Land Area Imperial: ' + city.landAreaInKm + '</div>' +
          '<div class="pop-dens">Population Density: ' + city.lastPopDensity + '</div>' +
           '<div class="pop-dens">Population Density Imperial: ' + city.lastPopDensityInKM + '</div>' +
          '<div class="state">State: ' + city.state + '</div>' +
          '<div class="Lat and Long">' + "Lat="+ lat + ',' +"Lon=" + lon + '</div>' +
          '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener('click', function() {
          infowindow.open($scope.map, marker);
        });

	}

  $scope.triggerClick = function(i){
    google.maps.event.trigger($scope.markers[i-1],'click');
  }

	$scope.cities = cities;
	for(i = 0; i< cities.length; i++){
		createMarker(cities[i])
	}

});
