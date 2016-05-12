appContext.controller('IncidentsController', function($scope, Incident, incidents) {

    var initView = function() {

        $scope.incidents = incidents;

    };

    $scope.$on('$ionicView.loaded', function() {
        initView();
    });

});
