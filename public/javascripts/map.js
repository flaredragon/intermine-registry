/**
 *
 * Map View Functionality .js
 *
 *
 */
// All mines object
var mines = {};

/**
 * Load mines from Registry
 */
function loadMines(){
  $.get("service/instances", function(response){
    var response = response.instances;
    for (var i = 0; i < response.length; i++){
      var mine = response[i];
      if (mine.location.latitude != ""){
        var name = mine.name;
        var url = mine.url;
        var lat = mine.location.latitude;
        var lon = mine.location.longitude;
        mines[name.toLowerCase()] = {
          name: name,
          location: {
            lat: lat,
            lon: lon,
            string: ""
          },
          url: url
        }
      }
    }
    mineMiner().init();
  });
}

var mineMiner = function() {
  var map;
  function init() {
    map = L.map('map').setView([mines.flymine.location.lat, mines.flymine.location.lon], 3);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'sk.eyJ1IjoieW9jaGFubmFoIiwiYSI6ImNpazEzdHZscTAyemR4NG01cWE2enZlcDQifQ.khbJ9AQiNTIdrniQRN8gEg'
    }).addTo(map);
    L.Icon.Default.imagePath = 'https://npmcdn.com/leaflet@1.0.0-rc.3/dist/images/'
    addMines();
  }

  $("#map").on( "click", function() {
      map.invalidateSize(false);
  });

  $("#map").mouseover(function() {
      map.invalidateSize(false);
  });


  /**
   * Adds all mines in the JSON to the map and make nice popups for them
   */
  function addMines(){
    var mineKeys = Object.keys(mines), mine;
    for (var i = 0; i < mineKeys.length; i++) {
      var minesToAdd = [];
      mine = mines[mineKeys[i]];
      // Check for mines with same location
      for (var j = 0; j < mineKeys.length; j++){
        var mineToCheck = mines[mineKeys[j]];
        if (mineToCheck.location.lat == mine.location.lat && mineToCheck.location.lon == mine.location.lon){
          minesToAdd.push(mineToCheck);
        }
      }
      //make marker
      L.marker([mine.location.lat, mine.location.lon])
      //push to map
      .addTo(map)
      //add a popup for it so users can click and learn things
      .bindPopup(makeMinePopup(minesToAdd));
    }
  }

  /**
   * Format HTML for the map mine popup
   **/
  function makeMinePopup(minesToAdd){
    var mineHtml = "";
    for (var j = 0; j < minesToAdd.length; j++){
      mine = minesToAdd[j];
      mineHtml += "<b>" + mine.name + "</b>";
      mineHtml += "<br />" + mine.location.string;
      mineHtml += "<br /><a href='" + mine.url + "' target='_blank'>" + mine.url + "</a>";
      mineHtml += "<br />";
      mineHtml += "<br />";
    }
    return mineHtml;
  }

  return {
    init: init
  }
};

document.addEventListener("DOMContentLoaded", function() {
    loadMines();
});
