angular.module('app.services', [])

.service('LoginService', ['$q', function($q) {
  var self = {
    data: {
      email: 'example@mail.com',
      phone: '+380730000000',
      type: 'email',
      code: ''
    },
    signup: function(email, phone, conformation) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      self.data.conformation = conformation;

      if (email == 'example@mail.com' && phone == '+380730000000') {
        deferred.resolve('Success!');
      } else {
        deferred.reject('Server validation error!');
      }

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      };
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      };
      return promise;
    },

    confirm: function(code) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      if (code == '0000') {
        deferred.resolve('Success!');
      } else {
        deferred.reject('Invalid code!');
      }

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      };
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      };
      return promise;
    },

    passwordRecovery: function(code) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      deferred.resolve('Success!');

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    },

    passwordRestore: function(code) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      deferred.resolve('Success!');

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  };
  return self;
}])

.service('SignInService', ['$q', function($q) {
  var self = {
    signin: function(email, password) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      if (email == 'example@mail.com' && password == '0000') {
        deferred.resolve('Success !');
      } else {
        deferred.reject('Wrong credentials.');
      }
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  };
  return self;
}])

.service('ProfileService', ['$q', function($q) {
  var self = {
    profile: {
      id: 1,
      email: "example@mail.com",
      password: "0000",
      fullname: "Иван Смирнов",
      honorific: "mr",
      gender: "male",
      birthday: new Date(1985, 9, 10),
      goverment: "ua",
      country: "ua",
      phone_code: "+38",
      phone: "073000000",
      passport: "EK000001",
      passport_validiti: new Date(2018, 2, 23),
      passport_country: "ua",
      passport_photo: "images/passport.jpg"
    },

    save: function(data) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      deferred.resolve('Success!');

      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  };

  return self;
}])

.factory('Trip', function($resource) {
  return $resource('https://example.com/api/something/trip/:id/', {
    id: '@id'
  }, {
    update: {
      method: 'PUT'
    }
  });
})

.service('Trips', [function(Trip) {

  var self = {

    trips: [{
      id: 2,
      from_country: "США",
      from_transport_type: "flight",
      from_transport_number: "PS 423",
      from_time: new Date(2015, 10, 25),
      to_country: "Италия",
      to_transport_type: "flight",
      to_transport_number: "PS 425",
      to_time: new Date(2015, 11, 10),
      address: "Some str. 25, ap.100",
      status: "current"
    },{
      id: 1,
      from_country: "Украина",
      from_transport_type: "flight",
      from_transport_number: "PS 423",
      from_time: new Date(2015, 10, 5),
      to_country: "США",
      to_transport_type: "flight",
      to_transport_number: "PS 425",
      to_time: new Date(2015, 10, 25),
      address: "Some str. 25, ap.100",
      status: "past"
    }],

    all: function() {
      return self.trips;
    },

    get: function(id) {
      for (var i = 0; i < self.trips.length; i++) {
        if (self.trips[i].id === parseInt(id)) {
          return self.trips[i];
        }
      }
      return null;
    },

    loadTrips: function() {
      var params = {};
      Trip.get(params, function(data) {
        self.trips = data;
      });
    },

    loadTrip: function(id) {

    },

    updateTrip: function(Trip) {
      Trip.update(Trip).$promise.then(function() {
        //is finishing
      });
      Trip.$update.then(function() {
        //is finishing
      });
    },

    removeTrip: function(Trip) {
      Trip.$remove.then(function() {
        //is finishing
      });
    },

    createTrip: function(Trip) {
      var d = $q.defer();
      Trip.save(Trip).$promise.then(function() {
        //is finishing
        self.loadTrips();
        toaster.pop('success', 'Created ' + Trip.name);
        d.resolve();
      });
      return d.promise;
      //позволяет использовать "then" при вызове этой функции
    }
  };

  //self.loadTrips();

  return self;
}]);
