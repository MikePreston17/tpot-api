const Genius = require("genius-lyrics"); // import the library
const Client = new Genius.Client(); // setup the Genius Lyrics API

async function retrieveLyrics(artist = "Weird Al Yankovic") {
  const songs = await Client.songs.search(artist); // Get songs from artist

  const indexSongs = Math.floor(Math.random() * Math.floor(songs.length));
  const lyrics = await songs[indexSongs].lyrics(); // Get random song

  const arrLyrics = lyrics.split("\n").filter((l) => l.length && l[0] !== "[");
  const indexLyrics = Math.floor(Math.random() * Math.floor(arrLyrics.length));
  return arrLyrics[indexLyrics]; // Return random lyrics
}

module.exports = async (req, res) => {
  const { query } = req;
  // const
  // this function will be launched when the API is called.
  console.log("body", query);
  try {
    res.send(await retrieveLyrics(req?.query?.artist)); // send the lyrics
  } catch (err) {
    res.send(err); // send the thrown error
  }
};
