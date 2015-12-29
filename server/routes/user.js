var user = {
  id: 0,
  email: "example@mail.com",
  password: "0000",
  fsname: "Иван Смирнов",
  before_fs: "mr",
  gender: "male",
  passp_birthday: '1985-11-04T22:00:00.000Z',
  goverment: "ua",
  country: "ua",
  phone_country: {
    phone_code: "+38"
  },
  phone: "073000000",
  passp_number: "EK000001",
  passp_date: '2018-11-04T22:00:00.000Z',
  passp_country: {
    iso_name: "UA"
  },
  passport: "http://mycode.in.ua/app/uploads/photo.jpg"
};

exports.getInfo = function (req, res, next) {
  res.send(user);
};