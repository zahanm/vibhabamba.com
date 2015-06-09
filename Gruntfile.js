/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      dev: {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))({}),
          ],
        },
        files: {
          "css/index.css": "styles/index.less"
        }
      }
    },
    watch: {
      dev: {
        files: ['styles/*.less'],
        tasks: ['less'],
        options: {
          spawn: false
        }
      }
    },
    connect: {
      server: {},
      options: {
        keepalive: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['less']);

};
