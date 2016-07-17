appContext.factory('IncidentFactory', function($q, $cordovaSQLite) {

    /**
     * get incident list from local db
     */
    var getLocalIncidentList = function(db){
        var deferred = $q.defer();
        var query="select * from incident ";
        $cordovaSQLite.execute(db,query).then(function(result){
            deferred.resolve(result);
        },function(reason){
          console.error(JSON.stringify(reason));
            deferred.reject(reason);
       })
       return deferred.promise;

    }

  	/**
  	* select incident details by id from local db
  	*/
      var getLocalIncidentById = function(db,id){

          var deferred = $q.defer();
          var query = 'SELECT * FROM incident where id='+id;
          $cordovaSQLite.execute(db, query).then(function(result) {
          	deferred.resolve(result);
          }, function(reason) {
          	console.error(JSON.stringify(reason));
              deferred.reject(reason);
          });

  	    return deferred.promise;
    	};


  /**
    * delete incident details from local db
    */
      var emptyIncidentTable = function(db){

          var deferred = $q.defer();
          var query = 'DROP TABLE IF EXISTS "incident"';
          $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
          }, function(reason) {
            console.error(JSON.stringify(reason));
              deferred.reject(reason);
          });

        return deferred.promise;
      };

    return {
        getLocalIncidentList : getLocalIncidentList,
        getLocalIncidentById : getLocalIncidentById,
        emptyIncidentTable : emptyIncidentTable
    }

});
