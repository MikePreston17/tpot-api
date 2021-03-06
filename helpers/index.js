/*Environment*/
export const devmode = (() =>
  process.env.NODE_ENV.toLocaleLowerCase !== "production")();
export const prodmode = (() =>
  process.env.NODE_ENV.toLocaleLowerCase === "production")();
export const uatmode = (() =>
  process.env.NODE_ENV.toLocaleLowerCase === "uat")();
export const testmode = (() =>
  process.env.NODE_ENV.toLocaleLowerCase === "test")();

export const environment = {
  mode: {
    PROD: prodmode,
    DEBUG: devmode,
    DEV: devmode,
    TEST: testmode,
    UAT: uatmode,
  },
};

export const deepFilter = (object, key, value) => {
  if (Array.isArray(object)) {
    for (const obj of object) {
      const result = deepFilter(obj, key, value);
      if (result) return obj;
    }
  } else {
    if (object.hasOwnProperty(key) && object[key] === value) {
      return object;
    }

    for (const k of Object.keys(object)) {
      if (typeof object[k] === "object") {
        const o = deepFilter(object[k], key, value);
        if (o !== null && typeof o !== "undefined") return o;
      }
    }

    return null;
  }
};

// https://gist.github.com/jacks0n/e0bfb71a48c64fbbd71e5c6e956b17d7
String.prototype.toPascalCase = function () {
  const words = this.match(/[a-z]+/gi);
  if (!words) {
    return "";
  }
  return words
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join("");
};

// https://bobbyhadz.com/blog/javascript-lowercase-object-keys
export function toLowerKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

export function toUpperKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toUpperCase()] = obj[key];
    return accumulator;
  }, {});
}

export function toPascalKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toPascalCase()] = obj[key];
    return accumulator;
  }, {});
}

// const json = require("./sample.json");
// const sample = json?.[0];

// const searchResult = deepFilter(json, "id", 290790);

// console.log("sample paper", sample?.id);
// console.log("searchResult", searchResult?.title?.rendered);

export * from "./web";
export * from "./wordpress";
