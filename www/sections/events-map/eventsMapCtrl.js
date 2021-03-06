starter.controller('eventsMapCtrl', function ($scope, $http, $state, $window, $rootScope, spinnerService, mapsService, credentialsService, httpService, alertService, eventsService) {

    $scope.eventsType = 'Eventos';
    $scope.currentView = 'EVENTS_MAP';

    /**
      Function responsible for generating the app's map and setting the proper view elements onto it.
    */
    function generateMap() {
        //Showing a custom spinner until the map has been rendered.
        spinnerService.showSpinner({
            fullscreen: true
        });
        //Since the function used to obtain gps coordinates doesn't support error callbacks, the app must set a timeout to evaluate if GPS is properly working or not.
        window.setTimeout(gpsTimeoutCallback, 30000);
        //Generates the map without any markers
        mapsService.instanceMap();
        //Gets the user coordinates in order to search for the nearest bakeries around.
        mapsService.getUserLocation($rootScope.map, function (pos) {
            eventsService.getCurrentlyGoingEvents($scope, function () {
                //If map has been loaded, the gps timeout function must not show anything.
                $rootScope.mapHasLoaded = true;

                mapsService.setEventsMarkers($rootScope.currentlyGoingEvents, pos, $rootScope);

                $rootScope.map.setCenter(pos);
                var centerControlDiv = document.createElement('div');
                mapsService.addMyLocationController(centerControlDiv, $rootScope.map, pos);
            })

        });
    }

    /**
      Function responsible for handling gps coordinates timeout.
      **/
    function gpsTimeoutCallback() {
        if (!$rootScope.mapHasLoaded) {
            //In case GPS doesn't respond in time, an alert must be shown
            spinnerService.hideSpinner();
            alertService.alert('Por favor, verifique sua conexão de dados e GPS e tente novamente.');
        }
    }

    // Every time the view loads, run this function
    $scope.$on('$ionicView.enter', function () {})

    // Every time the view loads, run this function
    $scope.$on('$ionicView.leave', function () {
        $rootScope.currentlyGoingEvents.forEach(function (event) {
            event.infoWindow.close();
        })
    })

    // Set cordova event to load map only when page has loaded on mobile
    if (window.cordova) {
        document.addEventListener("deviceready", generateMap, false);
    }
    // Set angular state to load map only when page has loaded on desktop (for tests only)
    else {
        angular.element(document).ready(generateMap);
    }
})