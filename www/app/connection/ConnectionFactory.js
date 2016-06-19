appContext.factory('ConnectionFactory', function($http, $q) {

    var isConnected = function() {
        //creation du promesse
        var deferred=$q.defer();

        var request = {
          url : "http://buzcard.fr/nepaseffacer.txt",
          method : "GET",
          timeout : 1000,
        }

        $http(request).success(function(data, status, headers, config ){
            // voila ma promese avec ok
            deferred.resolve();
        }).error(function(data, status, headers, config ){
          //voila ma promesse avec un dsl
            deferred.reject();
        });
        //je te promis
        return deferred.promise;
    };

    return {
       isConnected : isConnected
    }

});
