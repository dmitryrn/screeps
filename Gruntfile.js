require("dotenv").config();

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-screeps");

  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL,
        password: process.env.SCREEPS_PASSWORD,
        branch: "tutorial-1",
        ptr: false,
      },
      dist: {
        src: ["out/*.js"],
      },
    },
  });
};
