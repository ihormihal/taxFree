var trips = [{
	id: 0,
	from_country: "Украина",
	from_transport_type: "flight",
	from_transport_number: "PS 423",
	from_time: '2015-11-04T22:00:00.000Z',
	to_country: "США",
	to_transport_type: "flight",
	to_transport_number: "PS 425",
	to_time: '2015-11-04T22:00:00.000Z',
	address: "Some str. 25, ap.100",
	status: "current"
},{
	id: 1,
	from_country: "США",
	from_transport_type: "flight",
	from_transport_number: "PS 423",
	from_time: '2015-11-04T22:00:00.000Z',
	to_country: "Италия",
	to_transport_type: "flight",
	to_transport_number: "PS 425",
	to_time: '2015-11-04T22:00:00.000Z',
	address: "Some str. 25, ap.100",
	status: "past"
},{
	id: 2,
	from_country: "Италия",
	from_transport_type: "flight",
	from_transport_number: "PS 423",
	from_time: '2015-11-04T22:00:00.000Z',
	to_country: "Германия",
	to_transport_type: "flight",
	to_transport_number: "PS 425",
	to_time: '2015-11-04T22:00:00.000Z',
	address: "Some str. 25, ap.100",
	status: "past"
}];


exports.findAll = function (req, res, next) {
	res.send(trips);
};

exports.findById = function (req, res, next) {
	var id = req.params.id;
	res.send(trips[id]);
};