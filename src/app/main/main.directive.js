'use strict';

angular.module('angularEventJourney')
	.filter('addEllipsis', function () {
    return function (input, scope) {
        if (input) {
            // Replace this with the real implementation
            return input.substring(0, input.length / 2) + '...';  
        }
    }
});