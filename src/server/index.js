const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();
var compression = require('compression') //import to express app
app.use(compression()) //add this as the 1st middleware

// serve the build folder
app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "../client/src/build/index.html"));
});

app.get("/", (req, res, next) => {
    // res.redirect("/TheChallange");
    if (!req.session || !req.session.baseUrl) {
      res.redirect("/login");
    } else {
      next();
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});