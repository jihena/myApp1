appContext.factory('ProfileFactory', function($q, $http, $cordovaSQLite) {

    /**
     * update user
     */
    var updateUserProfil = function(db, user) {
        var deferred = $q.defer();
        var query = "update identifiant set profilPhoto='" + user.profilPhoto + "'"
            "where id=" + user.id + "";
        //  console.warn(query);
        $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
        }, function(reason) {
            console.warn( reason)
            deferred.reject(reason)
        });
        return deferred.promise;
    };

    return {
        updateUserProfil : updateUserProfil

    }
})
