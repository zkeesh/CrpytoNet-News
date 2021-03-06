
var express = require("express");

var exphbs = require("express-handlebars");

var bodyParser = require("body-parser");

var logger = require("morgan");

var mongoose = require("mongoose");






// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


var Article = require("./articleModel.js");

// Initialize Express
var app = express();

// Configure the app to use body parser and morgan
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Static file support with public folder
app.use(express.static("public"));

// Here's how we hook mongoose with the mongodb database
// Our database: cryptonetnews
mongoose.connect("mongodb://localhost/cryptonetnews");

// Save our mongoose connection to db
var db = mongoose.connection;

// If there's a mongoose error, log it to console
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once we "open" a connection to mongoose, tell the console we're in
db.once("open", function() {
  console.log("Mongoose connection successful.");
});




app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname,'/views'));























// Routes
// ======
var result;
// This GET route let's us see the books we have added
app.get("/", function(req, res) {
  result = "";
  // Using our Book model, "find" every book in our book db
  Article.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {

      console.log(doc);


      for(var i = 0; i < doc.length; i++){
        var currentElem = doc[i];
        result += "<h1> " + currentElem.title + "</h1>";
        // result += "<h2>"  + currentElem.coin + "</h2>";
        result += "<img src='" + currentElem.image+ "'>";
        // result += "<h6>" + currentElem.link + "</h6>";
      }
      res.send(result);
    }
  });
});

// We handle posts to our mongodb database here
app.post("/submit", function(req, res) {

  // We use the "Example" class we defined above
  // to check our req.body against our Example model
  var content = new Article(req.body);

  // With the new Example object created, we can save our data to mongoose
  // Notice the different syntax. The magic happens in exampleModel.js
  content.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise, send the new doc to the browser
    else {
      res.send(doc);
    }
  });
});

// app.get('/home', function(request, response){
//   res.sendFile(, {article: article})
// });

app.get('/home',function(req,res){
  // Using our Book model, "find" every book in our book db
  Article.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      /// JSON --> HTML????

      console.log(doc);

      var result = "";
      for(var i = 0; i < doc.length; i++){
        var currentElem = doc[i];
        result += "<h1> " + currentElem.title + "</h1>";
        result += "<h2>"  + currentElem.coin + "</h2>";
        result += "<img src='" + currentElem.image+ "'>";
        result += "<h6>" + currentElem.link + "</h6>";
      }

      res.render("index", {title: doc[0].title, coin: doc[0].coin})

      var htmlToRender = "<h1>First Article</h1>" +
      "<h2>Bitcoin</h1>" +
      "<h1>Second Article</h1>" +
      "<h2>Bitcoin</h1>";
      res.send(result);
    }
  });
});


//assuming app is express Object.
app.get('/add',function(req,res){

    //  res.sendFile('public/admin.html');
     res.sendFile(__dirname + '/public/admin.html');

});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
