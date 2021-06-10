const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080


const bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};


function generateString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => { //wildcard! -->  " : " and then name, integer, whatever is a wildcard beware.
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});



app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[this.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // console.log(req.params.shortURL);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  // creates a new entry in the URL database
  console.log(req.body.longURL); // www.reddit.com  // Log the POST request body to the console
  
  const newID = generateString(6);
  //urlDatabase[newID] = "http://gmail.com";
  urlDatabase[newID] = req.body.longURL;

  console.log(req.body); // { longURL: "www.reddit.com" }
  
  res.redirect('/urls');
});
//Add a POST route that updates a URL resource;
app.post('/urls/:shortURL/update', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});


//POST route that removes a URL resource:
app.post("/urls/:shortURL/delete", (req, res)=>{
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res)=> {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

//UserLogout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});
//Registration form
app.get('/register', (req, res)=>{
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  };
  res.render('registration', templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
