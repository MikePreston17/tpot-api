//https://hevodata.com/learn/wordpress-rest-api/
// https://www.hostinger.com/tutorials/wordpress-rest-api

const endpoint = `https://www.thepathoftruth.com/wp-json/wp/v2/pages`;
const { devmode } = require("../helpers");

// const replaceAll = (str, rgx) => str.replace( new RegExp(rgx,'g'))
export const getUrl = ({ slug, status, keyword, id }) => {
  devmode && console.log("params", { keyword, slug, status, id });

  if (!!slug) return `${endpoint}?slug=${slug}`;
  else if (!!keyword)
    return `https://www.thepathoftruth.com/wp-json/wp/v2/search?search='${keyword}'`;
  else if (!!status) return `${endpoint}?status=${status}`;
  else if (!!id || id === 0) return `${endpoint}/${id}`;
};

const domain = "https://www.thepathoftruth.com/";
export const parseSlug = (url = "") => url.replace(domain, "").replace(".htm");

/**
 *
 * Working Search for posts+pages (can't do /pages, unfortunately)
 * https://www.thepathoftruth.com/wp-json/wp/v2/search?search=Opinion
 * https://www.thepathoftruth.com/wp-json/wp/v2/search?search='Opinion'
 *
 *
 * Working GET by the post/page Id:
 * https://www.thepathoftruth.com/wp-json/wp/v2/pages/6399
 */
