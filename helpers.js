const findUserByEmail = (email, db) => {
  for (const userId in db) {
    let user = db[userId];
    if (user.email === email) {
      return user;
    }
  }
};


const generateString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const findUserById = (id, db)=> {
  for (const userId in db) {
    let user = db[userId];
    if (user.id === id) {
      return user;
    }
  }
};

//fiters current user's links and selects it from the URL database.
const urlsForUser = (id, db) =>{
  let result = {};
  for (const [key, value] of Object.entries(db)) {
    if (value.userID == id) {
      Object.assign(result, {[key]: value});
    }
  }
  return result;
};


module.exports = {findUserByEmail, generateString, findUserById, urlsForUser};