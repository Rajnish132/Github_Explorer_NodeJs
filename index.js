var express = require("express");
var github = require("github-profile");
var githubemail = require("github-email-js").githubEmail;
var bodyparser = require("body-parser");
var app = express();
var repoName = require('git-repo-name');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.set("view engine", "ejs");
 
app.get("/", (req, res) => {
  res.render("index", { profile: "",email:"" });
});
 
app.post("/getinfo", async(req, res) => {
  const { npm, recentActivity, recentCommits } = await githubemail({
    username: req.body.username,
  })
 
  github(recentActivity[0]).then((profile) => {
    console.log(profile);
    
    // var repoName = repoName.sync();
    // console.log(repoName);

  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "git_data"
  });

  //  Database connection
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    //Insertion
    var sql = "INSERT INTO profile (Name, Location, Bio, Followers, Public_Repos, Repos) VALUES ('" + profile.name + "', '" + profile.location + "', '" + profile.bio + "', " + profile.followers + ", " + profile.public_repos + ", '" + profile.repos_url + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      else
      {
        console.log("Record inserted successfully");
        res.render("index", { profile: profile, email: recentActivity[0] })
      }

    });

    // Retrieve the data from table
    con.query(`select * from profile`, function(err, result, fields) {
      if (err) {
          return console.log(err);
      }
      return console.log(result);
  })
  })

});
});


app.listen(5000, () => {
  console.log("App is listening on Port 5000");
});      




// var github = require('github-profile')
 
// github('78337792+Rajnish132@users.noreply.github.com')
//     .then((profile) => {
//     console.log(profile);
