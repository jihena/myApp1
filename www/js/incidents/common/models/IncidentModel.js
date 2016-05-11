angular.module('IncidentModel', [])

.factory('Incident', function() {

  function Incident(title, year, runtime, director, actors, plot, poster, imdbRating) {
      this.title = title;
      this.year = year;
      this.runtime = runtime;
      this.director = director;
      this.actors = actors;
      this.plot = plot;
      this.poster = poster;
      this.imdbRating = imdbRating;
  }

  Incident.build = function(data) {
    if(!data)
        return null;
    return new Incident(data.Title, data.Year, data.Runtime, data.Director, data.Actors, data.Plot, data.Poster, data.imdbRating);
  }

  Incident.prototype.toJson = function() {
    return angular.toJson(this);
  }

  Incident.fromJsonBunch = function(data) {
    if(angular.isArray(data)) {
      return data.map(Incident.build).filter(Boolean);
    }
    return Incident.build(data);
  }

  return Incident;
})
