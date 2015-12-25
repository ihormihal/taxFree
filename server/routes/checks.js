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


exports.findAll = function (req, res, next) {
	res.send(checks);
};

exports.findById = function (req, res, next) {
	var id = req.params.id;
	res.send(checks[id]);
};