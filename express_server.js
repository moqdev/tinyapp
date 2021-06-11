const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080


const bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


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



function generateString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function findUserByEmail(email) {
  for (const userId in users) {
    let user = users[userId];
  
    if (user.email === email) {
      return user;
    }
  }
  
}
function findUserById(id) {
  for (const userId in users) {
    let user = users[userId];
  
    if (user.id === id) {
      return user;
    }
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//If someone is not logged in when trying to access /urls/new, redirect them to the login page.
app.get("/urls/new", (req, res) => {
  if (req.cookies.user_id) {
    res.render("urls_new");
  } else {
    res.redirect("/login");
  }
  
});

app.get("/urls/:shortURL", (req, res) => { //wildcard! -->  " : " and then name, integer, whatever is a wildcard beware.
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  
  const user = findUserById(req.cookies.user_id);
  const templateVars = { urls: urlDatabase, user};
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[this.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
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
app.get("/login", (req, res) => {
  const templateVars = {userId: users[req.cookies.user_id]};
  res.render("login", templateVars);
});

app.post("/login", (req, res)=> {
  const {email,password} = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    res.status(403).send("Invalid email");
  }
  if (user.password === password) {
    const templateVars = {
      email: user.email,
      userId: user.id
    };
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Invalid password");
  }

});

//UserLogout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});
//Registration form
app.get('/register', (req, res)=>{
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userId: req.cookies.user_id //Modify the logout endpoint
  };
  res.render('registration', templateVars);
});

app.post('/register', (req, res)=>{
  const {email, password} = req.body;
  const id = generateString(4);

  const newUser = {id, email, password};
  if (email === "" || password === "") {
    res.status(400).send("Error occurred. Oops, don't worry, everyone has an off day. Please try again.");
  }
  if (findUserByEmail(email)) {
    res.status(400).send("Error occurred. Oops, don't worry, everyone has an off day. Please try again.");
  }
  users.id = newUser;
  res.cookie("user_id", id);
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
