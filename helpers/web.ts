// export function urlExists(url) {
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function () {
//     console.log("xhr", xhr);
//     if (xhr.readyState === 4) {
//       //   callback();
//       return xhr.status < 400;
//     }
//   };
//   xhr.open("HEAD", url);
//   xhr.send();
//   console.log("xhr", xhr);
//   return xhr?.status == 200;
// }

const request = require("request");
export const urlExists = (url) =>
  new Promise((resolve, reject) =>
    request
      .head(url)
      .on("response", (res) => {
        resolve(res.statusCode.toString()[0] === "2");
      })
      .on("error", () => {
        reject(false);
      })
  );
