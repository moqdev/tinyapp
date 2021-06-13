const { assert, expect } = require('chai');

const {findUserByEmail, findUserById } = require('../helpers.js');



const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with a valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert(expectedOutput === user.id, "correct id");
  });

  it('should return a user as undefined with an invalid email', function() {
    const user = findUserByEmail("userUnknown@example.com", testUsers);
    expect(user).to.be.undefined;
  });

});

describe('finduserById', function() {
  it('should return a user with a valid id', function() {
    const user = findUserById("userRandomID", testUsers);
    expect(user['email']).to.equal("user@example.com");
  });
  
});