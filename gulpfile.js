'use strict';

// Big gulps, huh?
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

gulp.task('test', function(){
  gulp.src(['./test/*.js','./test/**/*.js'], { read:false })
    .pipe(mocha({
      reporter: 'spec',
    }));
});

gulp.task('lint', function(){
  gulp.src(['./test/*.js','./test/**/*.js','./lib/*.js','./lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function(){

  gulp.watch(['./test/*.js','./test/**/*.js','./lib/*.js','./lib/**/*.js'],[
    'lint',
    'test'
  ]);

});
