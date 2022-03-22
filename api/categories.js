const axios = require("axios");

module.exports = async (req, res) => {
  console.log("req", req);
  let url = `https://www.thepathoftruth.com/wp-json/wp/v2/categories`;

  const response = await axios(url);
  console.log("response", response?.data);

  res.send(response.data);
};
