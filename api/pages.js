// https://www.hostinger.com/tutorials/wordpress-rest-api
// https://www.testim.io/blog/jsdom-a-guide-to-how-to-get-started-and-what-you-can-do/
// https://coditty.com/code/wordpress-rest-api-how-to-get-content-by-slug

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axios = require("axios");
const {
  devmode,
  prodmode,
  environment,
  deepFilter,
  urlExists,
} = require("../helpers");
const { getUrl } = require("../helpers/wordpress");

async function asyncPromAll(tasks = []) {
  console.log("tasks", tasks);
  const resultArray = await Promise.all(tasks);
  for (let i = 0; i < resultArray.length; i++) {
    console.log(resultArray[i]);
  }
  console.log("resultArray", resultArray);
}

const extractLinks = (html = "") => {
  const dom = new JSDOM(html);

  console.log("links found: ");
  let links = [];
  dom.window.document.querySelectorAll("a").forEach((link) => {
    links.push(link.href);
  });

  dom.window.document.querySelectorAll("link").forEach((link) => {
    links.push(link.rel);
  });

  return links;
};

const processWordpressResponse = async (response) => {
  const pages = response?.data;

  const info = pages?.map((p) => {
    let links = extractLinks(p?.content?.rendered);

    // console.log("p", p);
    // console.log("links", links);

    // Here's the most important info we want back.
    return {
      excerpt: p?.excerpt?.rendered,
      title: p?.title?.rendered,
      author: p?.author,
      categories: p?.categories,
      tags: p?.tags,
      slug: p?.slug,
      status: p?.status,
      description: p?.description,
      comment_status: p?.comment_status,
      links,
    };
  });

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

  return {
    // pages,
    ...info,
  };
};

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

  const goodStuff = await processWordpressResponse(response);
  console.log("goodStuff", goodStuff);

  try {
    // res.send(response?.data);
    res.send(goodStuff);
  } catch (err) {
    res.send(err); // send the thrown error
  }
};
