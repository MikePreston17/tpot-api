// https://www.hostinger.com/tutorials/wordpress-rest-api
// https://www.testim.io/blog/jsdom-a-guide-to-how-to-get-started-and-what-you-can-do/
// https://coditty.com/code/wordpress-rest-api-how-to-get-content-by-slug

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axios = require("axios");
const { devmode, toPascalKeys } = require("../helpers");
const { getUrl } = require("../helpers/wordpress");
const { createNode, createRelationship } = require("../helpers/neo");

module.exports = async (req, res) => {
  devmode && console.log("query params: >> ", req?.query);
  const url = getUrl(req?.query);
  devmode && console.log("url :>> ", url);
  const response = await axios.get(url, {
    per_page: 3,
    page: 1,
    _embed: true,
  });

  console.log("response.data", !!response?.data);
  let teachings =
    response?.data?.length > 0 ? response?.data : [response?.data];
  console.log("teachings found : >> ", teachings?.length || 0);

  const pages = await processWordpressResponse(teachings);

  devmode && console.log("pages", pages?.length || 0);

  await createPageNodes(pages);
  await createRelationship(pages);

  // Fire and forget! (works, but still too long...)
  // await Promise.all([createPageNodes(pages), createRelationship(pages)]);

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
async function createPageNodes(pages = []) {
  const tasks = pages.map((page) => {
    let keys = Object.keys(page).filter(
      (k) => !["Categories", "Tags"].includes(k)
    );

    return createNode("Page", page, [keys]);
  });

  return await Promise.all(tasks);

  // for (let index = 0; index < pages.length; index++) {
  //   // const element = array[index];
  //   const page = pages[index];
  //   // Create a node, if not exists
  //   let keys = Object.keys(page).filter(
  //     (k) => !["Categories", "Tags"].includes(k)
  //   );
  //   console.log("keys", keys?.length);
  //   await createNode("Page", page, [keys]);
  // }
}

const processWordpressResponse = async (pages = []) => {
  // devmode && console.log("pages?.[0]", pages?.[0]);
  // return [];
  const info = pages?.map((p) => {
    // console.log("p?.Title", p?.Title);
    let links = extractLinks(p?.content?.rendered);

    // devmode &&console.log("p", p);
    // devmode && console.log("links", links?.length);

    // Here's the most important info we want back.

    return {
      // api results, flattened a bit
      Id: p?.id,
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
