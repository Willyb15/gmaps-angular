var mapsApp = angular.module('mapsApp', []);
mapsApp.controller('mapsController', function ($scope){
  $scope.markers = [];
  infowindow = new google.maps.InfoWindow;
  
  $scope.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    //geographical center of the US
    center: new google.maps.LatLng(40.0000, -98.0000)
  }); 

// $scope.showMe = false;
//     $scope.myFunc = function() {
//         $scope.showMe = !$scope.showMe;
//     }


  $scope.searchFire = function(i) {
    var latLon = cities[i].latLon.split(',');
    var lat = Number(latLon[0]);
    var lon = Number(latLon[1]);
    var searchArea = {
      lat: lat, 
      lng: lon
    };
   
    $scope.map.setCenter(new google.maps.LatLng(lat,lon));
    $scope.map.setZoom(10);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService($scope.map);
    
    service.nearbySearch({
      location: searchArea,
      radius: 50000,
      type: ['fire_station']
    }, callback);
  };
  
  searchHealth = function(lat, lon){
    var searchArea = {
      lat: lat, 
      lng: lon
    };
    $scope.map.setCenter(new google.maps.LatLng(lat,lon));
    $scope.map.setZoom(10);
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService($scope.map);
    service.nearbySearch({
      location: searchArea,
      radius: 5000,
      type: ['hospital']
    }, callback);
    event.preventDefault();
  };

  $scope.reset = function(){
    $scope.map.setCenter(new google.maps.LatLng(40,-98));
    $scope.map.setZoom(4);
  };

  function callback(results, status) {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createSearchMarker(results[i]);
      }
    }
  }

  function createSearchMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open($scope.map, this);
    });
  }


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
      '<div class="yearRank">US Population Rank: ' + city.yearRank + '</div>' +
      '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>' +
      '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>' +
      '<div class="pop-change">Population Change %: ' + city.change + '</div>' +
      '<div class="land-area">Land Area: ' + city.landArea + '</div>' +
      '<div class="land-areaInKM">Land Area Imperial: ' + city.landAreaInKm + '</div>' +
      '<div class="pop-dens">Population Density: ' + city.lastPopDensity + '</div>' +
      '<div class="directions"><a href="" onclick=getDirections('+lat+','+lon+');>Get Directions!</a></div>' +
      '<div class="directions"><a href="" onclick=searchHealth('+lat+','+lon+');>Locate Hospitals!</a></div>' +
      '</div>';

    marker.addListener('click', function(){
      infowindow.setContent(contentString);
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
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
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
    console.log($scope.selectCity);
    console.log(i);
    google.maps.event.trigger($scope.markers[i],'click');
  }

  $scope.cities = cities;
  for(i = 0; i< cities.length; i++){
    createMarker(cities[i])
  }
});

// $scope.hide = function (){
//   ng-hide == "true";
// }