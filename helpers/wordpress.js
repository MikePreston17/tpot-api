const endpoint = `https://www.thepathoftruth.com/wp-json/wp/v2/pages`;
const { devmode, environment } = require("../helpers");

export const getUrl = ({ slug, status, keyword, id }) => {
  devmode && console.log("params", { keyword, slug, status, id });

  if (!!slug) return `${endpoint}?slug=${slug.replaceAll(`'`, "")}`;
  else if (!!keyword) return `${endpoint}/?s=${keyword.replaceAll(`'`, "")}`;
  else if (!!status) return `${endpoint}?status=${status}`;
  else if (!!id || id === 0) return `${endpoint}/${id}`;
};

const domain = "https://www.thepathoftruth.com/";
export const parseSlug = (url = "") => url.replace(domain, "").replace(".htm");
