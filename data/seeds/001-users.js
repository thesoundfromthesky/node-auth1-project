const bcryptjs = require("bcryptjs");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "user1", password: bcryptjs.hashSync("password1") },
        { username: "user2", password: bcryptjs.hashSync("password2") },
        { username: "user3", password: bcryptjs.hashSync("password3") },
      ]);
    });
};
