appContext.factory('AddFactory', function($http, $q, $cordovaSQLite, $rootScope) {

    /**
     * the report server call
     */
    var doReport = function(incident) {
        // the request parameters
        var reportRequest = {
            method: 'POST',
            //url: 'http://192.168.1.107/emergency/web/app.php/incident/report',
            url: 'http://127.0.0.1/emergency/web/app_dev.php/incident/report',
            //url: 'http://192.168.1.69/emergency/web/app.php/incident/report',

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            timeout: 4000,
            data: {
                type: incident.newType,
                title: incident.newTitle,
                description: incident.newDescription,
                date: incident.date,
                photo:incident.newPhoto,
                longitude:incident.longitude,
                latitude:incident.latitude,
                userId:localStorage.getItem("userId")
            }
        };
        // the HTTP request
        return $http(reportRequest);
    };
    /**
     * create incident table
     */
    var createIncidentTable = function(db) {
        var deferred=$q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS incident (' +
            'id INTEGER PRIMARY KEY, ' +
            'type text, title text, description text, date date, photo text, longitude text, latitude text)';
        $cordovaSQLite.execute(db, CreateQuery).then(
            function(result) {
              console.log(result);
                deferred.resolve();
            },
            function(reason) {
                deferred.reject();
            });
        return deferred.promise;
    }
    /**
     * save the incident credentials into the incident Table
     */
    var addIncident = function(db, type, title, description, date, photo, longitude, latitude) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, " INSERT INTO incident ( type, title, description, date, photo, longitude, latitude) VALUES (?,?,?,?,?,?,?) ",
                                   [ type, title, description, date, photo, longitude, latitude]).then(function(result) {
              console.log('------------'+result);
            deferred.resolve();

        }, function(reason) {
          console.log(reason);
           deferred.reject();
        });
        return deferred.promise;

    }
    /**
     * delete all records from incident table
     */
    var emptyIncidentTable = function(db) {
        var deferred=$q.defer();
        var query = "DELETE FROM incident";
        $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
         return deferred.promise;
    };

    var removeIncident = function(db, id){
      var deferred=$q.defer();
      var query = "DELETE FROM incident where id="+id;
      $cordovaSQLite.execute(db, query).then(function(result) {
          deferred.resolve(result);
      }, function(reason) {
          deferred.reject(reason);
      });
       return deferred.promise;
    }

    /**
     * the factory return
     */
    return {
        doReport : doReport,
        createIncidentTable : createIncidentTable,
        addIncident : addIncident,
        emptyIncidentTable : emptyIncidentTable,
        removeIncident : removeIncident,
    }

});
