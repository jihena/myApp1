angular.module('OMDBIncidentsModule', ['IncidentModel'])

.constant('incidentNames', [
    'the martian',
    'interstellar',
    'star wars episode VII',
    'jupiter ascending',
    'batman v superman',
    'moonwalkers',
    'independence day Resurgence',
    'star trek beyond',
    'The Space Between Us',
    'Rogue One: A Star Wars Story'
])

.constant('omdbApi', (function() {
    var namePlaceholder = '[namePlaceholder]';

    return {
        url: 'http://www.omdbapi.com/?t=' + namePlaceholder + '&y=&plot=short&r=json',
        namePlaceholder: namePlaceholder
    };
})()
)

.factory('IncidentsService', function($http, $q, incidentNames,omdbApi, Incident) {

    //service and data members
    var incidentsService = {};
    incidentsService.incidents =[];
    incidentsService.selectedIncident = null;

    //private static method to get url from title
    var urlFromTitle = function(title) {
        //replace SPACES in the title by +
        var queryString = title.split(' ').join('+');
        //replace placeholder with query
        var url = omdbApi.url.replace(omdbApi.namePlaceholder, queryString);
        return url;
    }

    //private static method to select incident by title
    var selectIncidentByTitle = function(title) {
        for(var i=0; i< incidentsService.incidents.length; i++) {
            if(incidentsService.incidents[i].title === title) {
              return incidentsService.incidents[i];
            }
        };
        return null;
    };

    //private static method to select incident id by title
    var selectPositionByTitle = function(title) {
        for(var i=0; i< incidentsService.incidents.length; i++) {
            if(incidentsService.incidents[i].title === title) {
              return i;
            }
        };
        return null;
    };

    incidentsService.getIncident = function(title) {
        var deferred = $q.defer();

        if(incidentsService.incidents.length > 0) {
            incidentsService.selectedIncident = selectIncidentByTitle(title);
            deferred.resolve(incidentsService.selectedIncident);
        }
        else {
            $http.get(urlFromTitle(title), {}).then(
              function(response) {
                incidentsService.selectedIncident = Incident.build(response.data);
                deferred.resolve(incidentsService.selectedIncident);
              },
              function(error) {
                incidentsService.selectedIncident = null;
                deferred.resolve(null);
              });
        }

        return deferred.promise;

    };

    incidentsService.getIncidentPositionByTitle = function(title) {
        var deferred = $q.defer();

        if(incidentsService.incidents.length > 0) {
            deferred.resolve(selectPositionByTitle(title));
        }
        else {
            incidentsService.getIncidents().then(
                function(response) {
                    deferred.resolve(selectPositionByTitle(title));
                },
                function(error) {
                  deferred.resolve(null);
                }
            );
        }

        return deferred.promise;

    };

    incidentsService.getIncidents = function() {
        var deferred = $q.defer();

        if(incidentsService.incidents.length > 0) {
            deferred.resolve(incidentsService.incidents);
        }
        else {
            var nDownloads = 0;
            var someErrorOccured = false;
            var resolveIfFinished = function(success) {
                nDownloads++;
                if(!success) {
                    someErrorOccured = true;
                }
                if(nDownloads === incidentNames.length) {
                    if(!someErrorOccured) {
                        deferred.resolve(incidentsService.incidents);
                    }
                    else {
                        deferred.reject();
                    }
                }
            };

            for(var i=0; i< incidentNames.length; i++) {
                $http.get(urlFromTitle(incidentNames[i]), {}).then(
                  function(response) {
                    incidentsService.incidents.push(Incident.build(response.data));
                    resolveIfFinished(true);
                  },
                  function(error) {
                    resolveIfFinished(false);
                  }
                );
            }
        }
        return deferred.promise;
    };

    return incidentsService;

})
