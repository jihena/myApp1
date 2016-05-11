angular.module('IncidentsModule')

.controller('IncidentDetailsController', function($scope, IncidentsService, currentIncidentIndex) {

    $scope.data = {};
    $scope.data.incidents = IncidentsService.incidents;

    var initView = function() {
        $scope.data.currentPage = currentIncidentIndex;

    };

    var setupSlider = function() {
        //some options to pass to our slider
        $scope.data.sliderOptions = {
            //initialSlide: index number of initial slide
            initialSlide: currentIncidentIndex,
            direction: 'horizontal',//or vertical
            //speed: duration of transition between slides (in ms)
            speed: 300,//0.3s transition
            grabCursor: true// this replaces cursor by a hand
        };

        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;

        //watch our sliderDelegate reference, and
        $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
            if(newVal != null) {
                $scope.data.sliderDelegate.on('slideChangeEnd', function() {
                // mySwiper.on(callback, handler) --> Add: callback/event handler
                    $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
                    //mySwiper.activeIndex returns index number of currently active slide
                    $scope.$apply();
                    //use $scope.$apply() to refresh any content(change page number)
                });
            }
        });
    }

    $scope.$on('$ionicView.loaded', function() {
        initView();
    });

    setupSlider();

});
