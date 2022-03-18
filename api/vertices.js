const axios = require("axios");
const { devmode, toPascalKeys } = require("../helpers");
const { getUrl } = require("../helpers/wordpress");
const { createNode, createRelationship } = require("../helpers/neo");

module.exports = async (req, res) => {
  const { id } = req?.query;

  //   await createPageNodes(pages);

  // let pages = [pageFound]
  // await createRelationship(pages)

  try {
    res.send(id);
  } catch (err) {
    res.send(err); // send the thrown error
  }
};
