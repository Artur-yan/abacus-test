/* eslint-disable */
// const fs = require('fs');
// const del = require('del');
// const ejs = require('ejs');
const webpack = require('webpack');

const tasks = new Map();

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve()
    .then(() => tasks.get(task)())
    .then(
      () => {
        console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
      },
      (err) => console.error(err.stack),
    );
}

//
// Clean up the output directory
// -----------------------------------------------------------------------------
// tasks.set('clean', () => del(['public/dist/*', '!public/dist/.git'], { dot: true }));
tasks.set('clean', () => {} /*del(['public/dist/assets.json', '!public/dist/.git'], { dot: true })*/);

// Bundle JavaScript, CSS and image files with Webpack
// -----------------------------------------------------------------------------
tasks.set('bundle', () => {
  const webpackConfig = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
});

//
// Build website into a distributable format
// -----------------------------------------------------------------------------
tasks.set('build', () =>
  Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('bundle')),
);

run(process.argv[2]);
