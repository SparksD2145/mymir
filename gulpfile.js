var gulp = require('gulp');

// Load Gulp Plugins
var plugins = require('gulp-load-plugins')({
  rename: {'gulp-typescript': 'ts'}
});
plugins.del = require('del');

// Build Typescript workspace
const tsProject = plugins.ts.createProject('tsconfig.json');

// Default Task
gulp.task('default', ['watch']);

// Build Task
gulp.task('build', ['clean'], () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

// Watch Task
gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.ts', ['build']);
});

// Clean Task
gulp.task('clean', () => {
  plugins.del(['dist']);
});
