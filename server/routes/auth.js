exports.login = function (req, res, next) {
  //res.header("Access-Control-Allow-Headers", "Authorization");
  res.send({
    access_token: "ZmRjYWY0YjE3MzllOTliZWI0NDc1OWQzMWVmNjVkY2IxNWQzNjVmNmQ1M2VkNzNhZDU0YWRhMzIyMTYzYWZkYw",
    expires_in: 3600,
    token_type: "bearer",
    scope: null,
    refresh_token: "NGM3NDgwOTNmYmU0MjI5NjUyYTkzNTZhZjAxZTdkNDdhMWMwZTBiZjUwZDY0YjcwY2Y2NzUyMjBkODYxNTUyNw"
  });
};

exports.logout = function (req, res, next) {
  //res.header("Access-Control-Allow-Headers", "Authorization");
  res.send({});
};