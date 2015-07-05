
starter.controller('eventDetailsCtrl', function($scope, $http, $rootScope, $stateParams, eventsService) {
    
    $scope.currentView = 'EVENTS';
    
	$scope.SHORT_TEXT = 300;
	$scope.LARGE_TEXT = 9999;

	$scope.readMore = function(){
		$scope.textLength = $scope.LARGE_TEXT;
	}

	$scope.readLess = function(){
		$scope.textLength = $scope.SHORT_TEXT;
	}

	$scope.$on('$ionicView.enter', function() {
		var eventId = $stateParams.id;
		eventsService.getEventDetails(eventId, function(eventInfo){
            console.log(eventInfo);
			$scope.textLength = $scope.SHORT_TEXT;
			$scope.event = eventInfo;
		});
	})

})
