'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.geocoder
 * @description
 * # geocoder
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('geocoderFactory', function ($http, $q) {

  	// use mapquest geocoding api
    var appKey = '0WGV61dvTFci9Fu8Liu9bmbnTGUz2f7b';
    var geocodeUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=" +  appKey + 
    					"&inFormat=kvp&outFormat=json&maxResults=1&thumbMaps=false&location=";
// Public API here
    return {
       initGeocode : function _initGeocode() {
 		  var obj = {
              markers : {
                1: {
                      lat: 0,
                      lng: 0,
                      focus: true,
                      draggable: false  
                    }
              },
              center : {
                lat: 0,
                lng: 0,  
                zoom : 18
              }
            };
           return obj;
       },
      getLatLng : function _getLatLng(address, objGeocode) {
      	var requestUrl = geocodeUrl + address;
      	var deferred = $q.defer();
      	$http.get(requestUrl).then(function (response) {
      		var latlng =response.data.results[0].locations[0].latLng;
      		console.log ("lat: " + latlng.lat + ", lng: " + latlng.lng);
      		var result = { 
            	lat: latlng.lat,
            	lng: latlng.lng,
      		};
      		deferred.resolve(result);
      	}, function(response) {
      		var result = {
    			lat: 0,
    			lng: 0
      		};
      		deferred.resolve(result);
      	});
      	return deferred.promise;
      }
    };
  });