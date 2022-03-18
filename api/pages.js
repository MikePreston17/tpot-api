// https://www.hostinger.com/tutorials/wordpress-rest-api
// https://www.testim.io/blog/jsdom-a-guide-to-how-to-get-started-and-what-you-can-do/
// https://coditty.com/code/wordpress-rest-api-how-to-get-content-by-slug

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axios = require("axios");
const { devmode } = require("../helpers");
const { getUrl } = require("../helpers/wordpress");
const { createNode, createRelationship } = require("../helpers/neo");

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

const processWordpressResponse = async (response) => {
  const pages = response?.data;

  const info = pages?.map((p) => {
    let links = extractLinks(p?.content?.rendered);

    // devmode &&console.log("p", p);
    // devmode && console.log("links", links);

    // Here's the most important info we want back.
    return {
      // api results, flattened a bit
      Title: p?.title?.rendered,
      Url: p?.link,
      Slug: p?.slug,
      Excerpt: p?.excerpt?.rendered,
      Categories: p?.categories,
      Tags: p?.tags,
      Author: p?.author,
      Status: p?.status,
      Description: p?.description || "",
      Comment_status: p?.comment_status,

      // the links found in page
      Links: links,
    };
  });

  return info;
};

module.exports = async (req, res) => {
  devmode && console.log("query params: >> ", req?.query);
  const url = getUrl(req?.query);
  //  devmode && console.log("url :>> ", url);

  const response = await axios.get(url, {
    per_page: 3,
    page: 1,
    _embed: true,
  });

  //   console.log("teachings found : >> ", response?.data?.length);

  const pages = await processWordpressResponse(response);
  devmode && console.log("pages", pages);

  await createPageNodes(pages);

  await createRelationship(pages);

  try {
    res.send(pages);
  } catch (err) {
    res.send(err); // send the thrown error
  }
};

/**
 * Creates pages in Neo4j db
 * @param {pages} pages
 */
async function createPageNodes(pages) {
  for (let index = 0; index < pages.length; index++) {
    // const element = array[index];
    const page = pages[index];
    // Create a node, if not exists
    let keys = Object.keys(page).filter(
      (k) => !["Categories", "Tags"].includes(k)
    );
    console.log("keys", keys);
    await createNode("Page", page, [keys]);
  }
}
/**
 * Dead link detection attempt... it works, but idk if we want to ping so much.  Might be best to let the users find them.  Then again...that's 1:1 or more.  Best to ask Ronnie.
 */

//   console.log("info", info);
//   const content = response?.data?.[0]?.content?.rendered;
//   devmode && console.log("content ?", !!content);

//   const promises = ["https://www.google.com"]
//     .map((u) => urlExists(u))
//     .catch((err) => {
//       devmode && console.log("err", err);
//     });
//   const deadLinks = await asyncPromAll(promises).then((r) => {
//     console.log("r", r);
//   });
//   console.log("deadLinks", deadLinks);
