var user = {
  id: 0,
  email: "example@mail.com",
  password: "0000",
  fullname: "Иван Смирнов",
  honorific: "mr",
  gender: "male",
  birthday: '1985-11-04T22:00:00.000Z',
  goverment: "ua",
  country: "ua",
  phone_code: "+38",
  phone: "073000000",
  passport: "EK000001",
  passport_validiti: '2018-11-04T22:00:00.000Z',
  passport_country: "ua",
  passport_photo: "images/passport.jpg",
  photo: "http://mycode.in.ua/app/uploads/photo.jpg"
};

exports.getInfo = function (req, res, next) {
  res.send(user);
};