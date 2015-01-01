'use strict';

angular.module('angularEventJourney')
	.filter('addEllipsis', function () {
    return function (input, limit, scope) {
        if (input) {
        	var inputLen = input.length;
        	if (inputLen > limit) {
        		inputLen = limit;
        	}
            // Replace this with the real implementation
            if (input.length > limit) {
	            return input.substring(0, inputLen) + '...';  
	        } else {
	        	return input;
	        }
        }
    }
});