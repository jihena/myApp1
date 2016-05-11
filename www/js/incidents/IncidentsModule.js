angular.module('IncidentsModule', ['IncidentModel', 'OMDBIncidentsModule'])

.config(function($stateProvider) {

    $stateProvider

        .state('app.incidents', {
          url: '/incidents',
          views: {
              'content': {
                  templateUrl: 'templates/incidents/incidents.html',
                  controller: 'IncidentsController',
                  resolve: {
                      incidents: function(IncidentsService) {
                          return IncidentsService.getIncidents();
                      }
                  }
              }
          }
        })

        .state('app.incidents-detail', {
          url: '/incidents/detail/:incidentTitle',
          views: {
              'content': {
                  templateUrl: 'templates/incidents/incidents-detail.html',
                  controller: 'IncidentDetailsController',
                  resolve: {
                      currentIncidentIndex: function(IncidentsService, $stateParams) {
                          return IncidentsService.getIncidentPositionByTitle($stateParams.incidentTitle);
                      }
                  }
              }
          }
        });

});
