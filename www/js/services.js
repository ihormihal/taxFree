angular.module('app.services', [])

.service('SignupService', [function(){
	return true;
}])

.service('LoginService', ['$q', function($q){
	var self = {
		// login: function(user){
		// 	if(user.username == 'root' && user.password == '0000') return true;
		// }
		loginUser: function(username, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (username == 'root' && password == '0000') {
                deferred.resolve('Welcome ' + username + '!');
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

.service('ProfileService', [function(){
	var self = {
		profile: {
			login: "root",
			password: "0000",
			name: "Ihor",
			surname: "Mykhalchenko",
			email: "ihor.mihal@gmail.com",
			phone: "+380734058015",
			birth_date: new Date(1989, 2, 17),
			goverment: "Ukraine",
			gender: "male",
			skype: "igor-mihal"
		}
	};
	
	return self;
}])

.factory('Trip', function($resource){
	return $resource('https://example.com/api/something/trip/:id/', {id: '@id'}, {
		update: {
			method: 'PUT'
		}
	});
})

.service('Trips', [function(Trip){
	
	var self = {
		
		trips: [
			{
				id: 1,
				label: "Trip First",
				city: "London",
				date_arrival: new Date(2015, 10, 5),
				date_depature: new Date(2015, 10, 12),
				flight_number: "1",
				comments: "Blablabla",
				reminder: ""
			},
			{
				id: 2,
				label: "Trip Second",
				city: "Paris",
				date_arrival: new Date(2015, 10, 13),
				date_depature: new Date(2015, 10, 20),
				flight_number: "2",
				comments: "Blablabla",
				reminder: ""
			}
		],
		
		all: function(){
			return self.trips;
		},
		
		get: function(id){
			for (var i = 0; i < self.trips.length; i++) {
				if (self.trips[i].id === parseInt(id)) {
					return self.trips[i];
				}
			}
			return null;
		},
		
		loadTrips: function(){
			var params = {};
			Trip.get(params, function(data){
				self.trips = data;
			});
		},
		
		loadTrip: function(id){
			
		},
	
		updateTrip: function(Trip){
			Trip.update(Trip).$promise.then(function(){
				//is finishing
			});
			Trip.$update.then(function(){
				//is finishing
			});
		},
	
		removeTrip: function(Trip){
			Trip.$remove.then(function(){
				//is finishing
			});
		},
		
		createTrip: function (Trip) {
			var d = $q.defer();
			Trip.save(Trip).$promise.then(function(){
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

