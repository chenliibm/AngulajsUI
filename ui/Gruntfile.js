// Project configuration.
module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      build: ['build'],
      tmp: ['build/tmp'],
      deploy: {
        options: {force: true},
        src: ['../server/public/']
      }
    },
    html2js: {
      options: {
        base:'src/'
      },
      main: {
        src: ['src/templates/*.html'],
        dest: 'build/tmp/templates.js'
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/js/app.js',
              'src/js/app/*.js',
              'build/tmp/templates.js'
             ],
        dest: 'build/js/app.js',
      },
    },
    copy: {
      build: {
        files: [
          {expand:true, cwd: 'src/css/', src:['**'], dest:'build/css'},
          {expand:true, cwd: 'src/image/',src:['**'], dest: 'build/image/'},
          {expand: true, cwd: 'src/fonts', src:['**'], dest: 'build/fonts/'},
          {expand:true, cwd: 'src/js/lib',src:['**'], dest: 'build/js/lib'},
          {expand:true, cwd:'bower_components',src:['**'], dest:'build/bower_components'},
          {flatten: true, src: ['src/index.html'], dest: 'build/index.html'}
        ]
      },
      deploy: {
        files: [
          {expand:true, cwd:'build/', src:['**'], dest:'../server/public/'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('build',['clean:build','html2js','concat','clean:tmp','copy:build']);
  grunt.registerTask('deploy', ['clean:deploy', 'copy:deploy']);
  grunt.registerTask('default', ['build','deploy']);

};