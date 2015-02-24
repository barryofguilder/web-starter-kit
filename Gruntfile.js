module.exports = function(grunt) {

  var paths = {
    // All the source file paths
    src: {
      html: ['*.html'],
      imagesRoot: 'img/',
      images: ['img/**/*.*'],
      js: ['js/**/*.js'],
      less: ['less/**/*.less'],
      lessMain: ['less/styles.less']
    },

    // Destination location for the builds
    dest: {
      build: 'build',
      css: 'build/css/styles.css',
      fonts: 'build/fonts',
      html: 'build/*.html',
      js: 'build/js/scripts.js',
      vendor: 'build/js/vendor.js'
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'cache-busting': {
      options: {
        cleanup: true
      },
      css: {
        replace: paths.dest.html,
        replacement: 'styles.css',
        file: paths.dest.css
      },
      scriptsApp: {
        replace: paths.dest.html,
        replacement: 'scripts.js',
        file: paths.dest.js
      },
      scriptsVendor: {
        replace: paths.dest.html,
        replacement: 'vendor.js',
        file: paths.dest.vendor
      }
    },

    clean: {
      build: {
        src: paths.dest.build + '/**/*'
      }
    },

    connect: {
      server: {
        options: {
          livereload: true,
          base: paths.dest.build,
          open: {
            appName: 'Google Chrome'
          }
        }
      }
    },

    concat: {
      options: {
        separator: '\n;\n'
      },
      app: {
        src: paths.src.js,
        dest: paths.dest.js
      },
      vendor: {
        src: [
          // jQuery
          'bower_components/jquery/dist/jquery.js',

          // Twitter Bootstrap
          'bower_components/bootstrap/js/transition.js',
          'bower_components/bootstrap/js/alert.js',
          'bower_components/bootstrap/js/button.js',
          'bower_components/bootstrap/js/carousel.js',
          'bower_components/bootstrap/js/collapse.js',
          'bower_components/bootstrap/js/dropdown.js',
          'bower_components/bootstrap/js/modal.js',
          'bower_components/bootstrap/js/tooltip.js',
          'bower_components/bootstrap/js/popover.js',
          'bower_components/bootstrap/js/scrollspy.js',
          'bower_components/bootstrap/js/tab.js',
          'bower_components/bootstrap/js/affix.js'
        ],
        dest: paths.dest.vendor,
      },
    },

    copy: {
      favicon: {
        files: [
          {expand: true, src: ['favicon.ico', 'apple-touch-icon.png'], dest: paths.dest.build},
        ]
      },
      fonts: {
        files: [
          {expand: true, flatten: true, src: ['bower_components/bootstrap/fonts/*.*'], dest: paths.dest.fonts}
        ]
      },
      html: {
        files: [
          {expand: true, src: paths.src.html, dest: paths.dest.build}
        ]
      },
      images: {
        files: [
          {expand: true, src: paths.src.images, dest: paths.dest.build}
        ]
      }
    },

    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: paths.src.imagesRoot,
          src: '**/*.*',
          dest: paths.src.imagesRoot
        }]
      },

      favicon: {
        files: [{
          expand: true,
          src: ['apple-touch-icon.png']
        }]
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        browser: true,
        curly: true,
        eqnull: true,
        eqeqeq: true,
        undef: true,
        devel: true,
        ignores: [],
        globals: {
          butcher: true,
          grecaptcha: true
        }
      },
      files: {
        src: paths.src.js
      }
    },

    less: {
      development: {
        src: paths.src.lessMain,
        dest: paths.dest.css
      },
      production: {
        options: {
          compress: true
        },
        src: paths.src.lessMain,
        dest: paths.dest.css
      }
    },

    uglify: {
      options: {
        report: 'min'
      },
      app: {
        src: paths.dest.js,
        dest: paths.dest.js
      },
      vendor: {
        src: paths.dest.vendor,
        dest: paths.dest.vendor
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      css: {
        files: paths.src.less,
        tasks: ['less'],
        options: {
          spawn: false
        }
      },
      html: {
        files: paths.src.html,
        tasks: ['copy:html'],
        options: {
          spawn: false
        }
      },
      images: {
        files: paths.src.images,
        tasks: ['copy:images'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: paths.src.js,
        tasks: ['jshint', 'concat:app'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-cache-busting');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['clean:build', 'less:development', 'jshint', 'concat', 'copy', 'connect', 'watch']);
  grunt.registerTask('build', ['clean:build', 'less:production', 'concat', 'imagemin', 'copy', 'uglify', 'cache-busting']);
};
