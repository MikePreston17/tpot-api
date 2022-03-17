// https://www.hostinger.com/tutorials/wordpress-rest-api
// https://www.testim.io/blog/jsdom-a-guide-to-how-to-get-started-and-what-you-can-do/
// https://coditty.com/code/wordpress-rest-api-how-to-get-content-by-slug

const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axios = require("axios");
const { devmode, prodmode, environment, deepFilter } = require("../helpers");
const { getUrl } = require("../helpers/wordpress");

module.exports = async (req, res) => {
  devmode && console.log("query params: >> ", req?.query);
  const url = getUrl(req?.query);
  console.log("url :>> ", url);

  const response = await axios.get(url, {
    per_page: 3,
    page: 1,
    _embed: true,
  });

  console.log("teachings found : >> ", response?.data?.length);

  const content = response?.data?.content?.rendered;
  devmode && console.log("content ?", !!content);

  const dom = new JSDOM(content);

  console.log("links found: ");
  dom.window.document.querySelectorAll("a").forEach((link) => {
    console.log(link.href);
  });

  const deadLinks = 

  try {
    res.send({
        links,

    });
  } catch (err) {
    res.send(err); // send the thrown error
  }
};
