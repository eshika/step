// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var map;
var guess;
var answer;

let finalScore = 0.0;

/** 
  * Initializes the regular map for users to guess
  * and the map marker that represents the user's guess. 
  */
function initMap() {
  const originCoords = {lat: 0.0, lng: 0.0};

  // Create world map
  map = new google.maps.Map(
      document.getElementById('guessMap'),
      {center: originCoords, 
      zoom: 1,
      streetViewControl: false,
  });

  // Create marker that represents guess 
  guess = new google.maps.Marker({
    position: originCoords, 
    map: map,
    draggable:true
  });

  guess.setVisible(false);

  // Allow guess marker to be dragged
  guess.addListener('dragend', function(e) {
    calcScore(e.latLng, answer);
  });
  
  // Allow guess marker location to change with click  
  const listener = map.addListener('click', function(e) {
    const pinLoc = e.latLng;
    guess.setPosition(pinLoc);
    if (!guess.getVisible()) {
      guess.setVisible(true);
    } 
    map.panTo(guess.getPosition());
    calcScore(pinLoc, answer);
  });

  // Create street view map
  randomPano(handleCallback);
}

/**
 * Randomly generates coordinates and attempts to create
 * street view map with those coordinates.
 */
function randomPano(callback) {
  const lat = (Math.random()*90)-90;
  const lng = (Math.random()*180)-180;
  const streetViewService = new google.maps.StreetViewService();
  const randomLoc = new google.maps.LatLng(lat, lng);
  streetViewService.getPanorama({
    location: randomLoc,
    radius: 50,
  }, callback);
}

/**
 * Generates street view map with valid coordinates. 
 */
function handleCallback(data, status) {
  if (status == 'OK') {
    answer = data.location.latLng;
    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById('streetMap'), {
          position: answer,
          addressControl: false,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
          showRoadLabels: false
    });
  } else {
    randomPano(handleCallback);
  }
}

/**
 * Calculates distance between two lat lng coordinates in miles. 
 * Code from: https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
 */
function calcScore(loc1, loc2) {
  const R = 3958.8; // Radius of the Earth in miles
  const rlat1 = loc1.lat() * (Math.PI/180); // Convert degrees to radians
  const rlat2 = loc2.lat() * (Math.PI/180); // Convert degrees to radians
  const difflat = rlat2-rlat1; // Radian difference (latitudes)
  const difflon = (loc2.lng()-loc1.lng()) * (Math.PI/180); // Radian difference (longitudes)
  finalScore = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+
                                Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
}

/**
 * Shows user distance between guess and answer 
 * and shows the original location on the map. 
 */
function submit() {
  alert("Distance: " + finalScore.toFixed(2) + " miles");
  const ansMarker = new google.maps.Marker({
    position: answer, 
    map: map,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    }
  });
  map.panTo(answer);
  const line = new google.maps.Polyline({path: [ansMarker.getPosition(), guess.getPosition()], map: map});
}
