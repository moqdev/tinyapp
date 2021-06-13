const express = require("express");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; // default port 8080
const {findUserByEmail, findUserById, generateString, urlsForUser } =  require("./helpers");
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
//Set the cookies in a session on the client.
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "user1": {
    id: "123",
    email: "user@example.com",
    password: "password123"
  },
  "user2": {
    id: "1234",
    email: "missmona@gmail.com",
    password: "password"
  }
};

const checkLogin = function(req, res, next) {
  const user = findUserById(req.session.user_id, users);
  const userLinks = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = { urls:userLinks, user};
  req.templateVars = templateVars;
  next();
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//If someone is not logged in when trying to access /urls/new, redirect them to the login page.
app.get("/urls/new", checkLogin,(req, res) => {
  
  if (req.session.user_id) {
    res.render("urls_new",  req.templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => { //wildcard! -->  " : " and then name, integer, etc., This is a wildcard beware.
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};

  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user = findUserById(req.session.user_id, users);
  const userLinks = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = { urls:userLinks, user};

  res.render("urls_index", user ? templateVars : null);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[this.shortURL] };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

// creates a new entry in the URL database
app.post("/urls", (req, res) => {
  const newID = generateString(6);
  urlDatabase[newID] = {longURL: req.body.longURL, userID: req.session.user_id};

  res.redirect('/urls');
});

//Add a POST route that updates a URL resource:
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

app.get("/login", (req, res) => {
  const templateVars = {userId: users[req.session.user_id]};

  res.render("login", templateVars);
});

app.post("/login", (req, res)=> {
  const {email,password} = req.body;
  const user = findUserByEmail(email, users);

  if (!user) {
    return res.status(403).send("Invalid email");
  }
  //compare the password from the client to the user's password.
  if (bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(403).send("Invalid password");
  }
});

//UserLogout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//Registration form
app.get('/register', (req, res)=>{
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userId: req.session.user_id
  };

  res.render('registration', templateVars);
});

app.post('/register', (req, res)=>{
  const {email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateString(4);
  //create user with the hashed password
  const newUser = {id, email,password:hashedPassword};

  if (email === "" || password === "") {
    res.status(400).send("Error occurred. Oops, don't sweat it, everyone has an off day. Please try again.");
  }

  if (findUserByEmail(email, users)) {
    res.status(400).send("Error occurred. Oops, it's all good! We all have an off day. Please try again.");
  }
  users.id = newUser;
  req.session.user_id = id;
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
