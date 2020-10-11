require("dotenv").config();

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-screeps");
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL,
        password: process.env.SCREEPS_PASSWORD,
        branch: "default",
        ptr: false,
      },
      dist: {
        src: ["out1/*.js"],
      },
    },

    // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
    copy: {
      // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
      screeps: {
        files: [{
          expand: true,
          cwd: 'out/',
          src: '**',
          dest: 'out1/',
          filter: 'isFile',
          rename: function (dest, src) {
            // Change the path name utilize underscores for folders
            return dest + src.replace(/\//g, '_');
          }
        }],
      }
    },
  });

  grunt.registerTask('default', ['copy:screeps', 'screeps']);
};
