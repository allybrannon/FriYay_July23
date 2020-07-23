const pgp = require("pg-promise")();
const connect = require("./config");
const db = pgp(connect);
module.exports = (app) => {
  app.get("/api/albums", async (req, res) => {
    let albums = await db.any("SELECT * FROM albums");
    res.send(albums);
  });
  //returns reviews
  app.get("/api/album/:id", async (req, res) => {
    let album = await db.one(
      `SELECT * FROM albums WHERE id='${req.params.id}'`
    );
    //this gets the reviews along with the user who reviewed
    let reviews = await db.any(
      `SELECT reviews.*, users.* from reviews JOIN users ON reviews.users_id=users.id WHERE reviews.album_id = '${req.params.id}';`
    );
    res.send({ album: album, reviews: reviews });
  });
  app.post("/api/new-albumn", async (req, res) => {
    let newAlbum = await db.one(
      `INSERT INTO albums (name, artist) VALUES ('${req.body.name}','${req.body.artist}' RETURNING *`
    );
    res.send(newAlbum);
  });
  app.delete("/api/delete-album/:id", async (req, res) => {
    let deleted = db.one(
      `REMOVE FROM albums WHERE id='${req.params.id}' RETURNING ${req.params.id}`
    );
    res.send({ deleted: deleted });
  });
  app.get("/api/users", async (req, res) => {
    let users = db.any("SELECT * FROM users");
    res.send(users);
  });
  app.get("/api/user/:id", async (req, res) => {
    let user = db.one(`SELECT * FROM users WHERE id='${req.params.id}'`);
    let reviews = db.any(
      `SELECT reviews.*, albums.* from reviews JOIN albums ON reviews.album_id=albums.id WHERE reviews.user_id='${req.params.id}`
    );
    res.send(users);
  });
};
