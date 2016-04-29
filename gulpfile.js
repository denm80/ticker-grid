// ------------------------------------------------------------------------------
// Load modules
// ------------------------------------------------------------------------------
var fs = require('fs'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    supervisor = require("gulp-supervisor"),
    browserSync = require("browser-sync");

var client = require('./config/client'),
    server = require('./config/server');

var tsConfServer = {
    target: 'es6',
    module: 'commonjs'
};

var tsConfClient = {
    target: 'es6',
    module: 'amd'
};

//------------------------------------------------------------------------------
// Directory management
// ------------------------------------------------------------------------------

gulp.task('clean', function () {
    del.sync([client.build.js + '/*', server.build.js + '/*']);
});

// ------------------------------------------------------------------------------
// Compile assets
// ------------------------------------------------------------------------------

var tsSimplifier = function (gulpStream, tsConf) {
    return gulpStream
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(ts(tsConf))
        .pipe(sourcemaps.write('.'));
};

gulp.task('typescript:client', function () {
    return tsSimplifier(gulp.src(client.src.ts), tsConfClient)
        .pipe(gulp.dest(client.build.js));
});

gulp.task('typescript:server', function () {
    return tsSimplifier(gulp.src(server.src.ts), tsConfServer)
        .pipe(gulp.dest(server.build.js));
});

gulp.task('typescript', ['typescript:client', 'typescript:server']);

// ------------------------------------------------------------------------------
// server
// -----------------------------------------------------------------------------
gulp.task('supervisor', function () {
    supervisor(server.entrypoint, {
        // args: [],
        watch: [server.entrypoint],
        pollInterval: 5000,
        extensions: ["js"],
        exec: "node",
        debug: true,
        debugBrk: false,
        harmony: true,
        noRestartOn: true,
        forceWatch: true,
        quiet: false
    });
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: client.root
        },
        port: client.port
    });

    gulp.watch(client.root + '/js/*.js').on('change', browserSync.reload);
    gulp.watch(client.root + '/css/*.css').on('change', browserSync.reload);
    gulp.watch(client.root + '/*.html').on('change', browserSync.reload);
});

gulp.task('server', ['supervisor', 'browser-sync']);
// ------------------------------------------------------------------------------
// Watch
// ------------------------------------------------------------------------------

gulp.task('watch', function () {
    gulp.watch(client.src.ts, ['typescript:client']);
    gulp.watch(server.src.ts, ['typescript:server']);
});

// ------------------------------------------------------------------------------
// Build
// ------------------------------------------------------------------------------

gulp.task('build', ['clean', 'typescript']);

// ------------------------------------------------------------------------------
// Default
// ------------------------------------------------------------------------------

gulp.task('default', ['build'], function () {
    gulp.start(['watch', 'server']);
});

