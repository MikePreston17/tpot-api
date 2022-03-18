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

// const json = require("./sample.json");
// const sample = json?.[0];

// const searchResult = deepFilter(json, "id", 290790);

// console.log("sample paper", sample?.id);
// console.log("searchResult", searchResult?.title?.rendered);

export * from "./web";
export * from "./wordpress";
