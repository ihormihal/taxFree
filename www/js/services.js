angular.module('app.services', ['ngResource'])

.service('AuthService', ['$rootScope', '$q', '$state', '$http', function($rootScope, $q, $state, $http) {
  var self  = {
    login: function(user) {
      $http({
        method: 'POST',
        url: 'http://tax-free.jaya-test.com/app_dev.php/oauth/v2/token',
        data: $rootScope.serialize({
          username: user.username,
          password: user.password,
          grant_type: 'password',
          client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
          client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        if(data.access_token){
          window.localStorage['token'] = 'Bearer '+ data.access_token;
          $http.defaults.headers.common['Authorization'] = window.localStorage['token'];
          $rootScope.$broadcast('auth-login');
        }
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('auth-login-failed', status);
      });
    },

    logout: function() {
      window.localStorage['token'] = false;
      delete $http.defaults.headers.common['Authorization'];
      $rootScope.$broadcast('auth-logout');
      console.log('AuthenticationService logout!');
    }

  };
  return self;
}])

.service('RegService', ['$rootScope', '$q', '$state', '$http', function($rootScope, $q, $state, $http) {
  var self = {
    data: {
      email: 'ihor.mihal@gmail.com',
      phone: '0734058015',
      confirmation: 'email',
      country: 1,
      user: null,
      code: null
    },
    getToken: function(){
      $http({
        method: 'POST',
        url: 'http://tax-free.jaya-test.com/app_dev.php/oauth/v2/token',
        data: $rootScope.serialize({
          grant_type: 'client_credentials',
          client_id: '2_3e8ski6ramyo4wc04ww44ko84w4sowgkkc8ksokok08o4k8osk',
          client_secret: '592xtbslpsw08gow4s4s4ckw0cs0koc0kowgw8okg8cc0oggwk'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        if(data.access_token){
          window.localStorage['token'] = 'Bearer '+ data.access_token;
          $http.defaults.headers.common['Authorization'] = window.localStorage['token'];
          $rootScope.$broadcast('auth-login');
        }
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('auth-login-failed', status);
      });
    },
    one: function(data){
      var q = $q.defer();
      $http({
        method: 'POST',
        url: 'http://tax-free.jaya-test.com/app_dev.php/api/user/register/one',
        data: $rootScope.serialize(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        q.resolve(data);
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('auth-login-failed', status);
        q.reject(data);
      });
      return q.promise;
    },
    two: function(data){
      var q = $q.defer();
      $http({
        method: 'POST',
        url: 'http://tax-free.jaya-test.com/app_dev.php/api/user/register/two',
        data: $rootScope.serialize(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      })
      .success(function(data, status, headers, config) {
        q.resolve(data);
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('auth-login-failed', status);
        q.resolve(data);
      });
      return q.promise;
    },
    tree: function(){

    }
  };
  self.getToken();
  return self;
}])

//http://localhost:5000/user/
//http://tax-free.jaya-test.com/app_dev.php/api/user/me
.factory('User', function ($resource) {
  return $resource('http://tax-free.jaya-test.com/app_dev.php/api/user/me', {}, {
    update: {
      method: 'PUT'
    }
  });
})

.service('UserService', function($q, User){
  var self = {
    profile: {},
    getProfile: function(){
      User.get({}, function(data){
        self.profile = new User(data);
      }, function(error){
        console.log(error.data.error);
      });
    },
    updateProfile: function(profile){
      profile.$update().then(function(){
        console.log('User updated!');
      },function(error){
        console.log(error.data.error);
      });
    }
  };
  self.getProfile();
  return self;
})

.factory('Trip', function($resource) {
  return $resource('http://tax-free.jaya-test.com/app_dev.php/api/trip/:id', {
    id: '@id'
  },{
    update: {
      method: 'PUT'
    }
  });
})

.service('TripService', function($q, Trip) {
  var self = {
    trips: [],
    trip: {},
    getList: function(){
      Trip.get({id: 'list'}, function(data){
        self.trips = data;
      }, function(error){
        console.log(error.data.error);
      });
    },
    get: function(id){
      Trip.get({id: id}, function(data){
        self.trip = new Trip(data);
      }, function(error){
        console.log(error.data.error);
      });
    }
  };
  self.getList();
  return self;
})

.factory('Check', function($resource) {
  return $resource('http://localhost:5000/checks/:id/', {
    id: '@id'
  },{
    update: {
      method: 'PUT'
    }
  });
})

.factory('CheckService', function($resource) {
  var checks = [{
    id: 0,
    title: "Gucci",
    time: '2015-11-04T22:00:00.000Z',
    status: "approved",
    images: [
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      },
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      },
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      }
    ]
  },{
    id: 1,
    title: "Nissan",
    time: '2015-11-04T22:00:00.000Z',
    status: "processed",
    images: [
      {
        url: 'http://mycode.in.ua/app/check.jpg'
      }
    ]
  },{
    id: 2,
    title: "Elitparfums",
    time: '2015-11-04T22:00:00.000Z',
    status: "refused",
    images: []
  }];

  var self = {
    getList: function(){
      return checks;
    },
    getOne: function(id){
      return checks[id];
    }
  };

  return self;

})

.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      return q.promise;
    }
  }
}])

;
