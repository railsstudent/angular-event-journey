'use strict';

angular.module('angularEventJourney')
  .factory('aboutMeFactory', function ($firebaseObject, $firebaseArray) {

  		var urlSkill = 'https://blazing-fire-2680.firebaseio.com/skills';
    
		return {

			addItem : function _addItem(category, newValue) {

				var url = urlSkill + '/' + category + '/list';
				console.log(url);
				return $firebaseArray(new Firebase(url)).$add({ value : newValue });
			},

			removeItem : function _removeItem(category, skillKey) {

				var url = urlSkill + '/' + category + '/list/' + skillKey;

				console.log('key = ' + skillKey);
				console.log('delete object from url: ' + url);
				console.log('category = ' + category);

				return $firebaseObject(new Firebase(url)).$remove();
			},

			updateItem: function _updateItem(category, skillKey, editValue) {
				var url = urlSkill + '/' + category + '/list/' + skillKey;

				console.log('key = ' + skillKey);
				console.log('update object from url: ' + url);
				console.log('category = ' + category);

				var ref = $firebaseObject(new Firebase(url));
				ref.value = editValue; 
				return ref.$save();				
			}
		};
});