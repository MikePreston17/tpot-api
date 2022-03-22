const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const json = require("./sample.json");
console.log("json", !!json);
const sample = json?.[0];
const html = sample?.content?.rendered;

const extractLinks = (html = "") => {
  const dom = new JSDOM(html);

  let links = [];
  dom.window.document.querySelectorAll("a").forEach((link) => {
    links.push(link.href);
  });

  // dom.window.document.querySelectorAll("link").forEach((link) => {
  //   links.push(link.rel);
  // });

  return links;
};

console.log("html", html);

const links = extractLinks(html);
devmode && console.log("lnks", links);
