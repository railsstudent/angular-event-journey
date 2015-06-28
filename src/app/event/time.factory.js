'use strict';

angular.module('angularEventJourney')
  .factory('timeFactory', [ 'moment', function (moment) {

	function _timeDiff(start, end) {
		var diff = moment(end).diff(moment(start));
		var duration = moment.duration(diff);
		return {
			duration : duration
		};
	}

	function _totalTime(start, end) {
			var diff = _timeDiff(start, end);
			return {
				hours: Math.floor(diff.duration.asHours()),
				minutes: diff.duration.minutes()
			};
	}

	return {
		timeDiff : _timeDiff,

		totalTime : _totalTime,

		totalTimeStr : function _fmtStr (start, end) {
			var duration = _totalTime(start, end);
			return duration.hours + ' hours ' + duration.minutes + ' minutes';
		}
	};
}]);
