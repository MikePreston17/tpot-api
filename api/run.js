const { devmode } = require("../helpers");
const { getUrl } = require("../helpers/wordpress");
const { executeCypherQuery } = require("../helpers/neo");

module.exports = async (req, res) => {
  const { query, ...rest } = req?.query;
  console.log("exec query", query);
  const result = await executeCypherQuery(query, rest);
  devmode && console.log("result?.data", !!result?.data);

  try {
    res.send(result);
  } catch (err) {
    res.send(err); // send the thrown error
  }
};
