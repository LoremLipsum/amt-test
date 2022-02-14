import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import del from "del";
import gulp from "gulp";
import concat from "gulp-concat";
import htmlmin from "gulp-htmlmin";
import squoosh from "gulp-libsquoosh";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import svgSprite from "gulp-svg-sprite";
import terser from "gulp-terser";
import twig from "gulp-twig";
import { htmlValidator } from "gulp-w3c-html-validator";
import postcss from "gulp-postcss";
import postCsso from "postcss-csso";
import postCustomMedia from "postcss-custom-media";
import postUrl from "postcss-url";
import postImport from "postcss-import";
import postNested from "postcss-nested";
import postMediaMinMax from "postcss-media-minmax";
import data from "./source/data/data.js";

export function buildingViews () {
	return gulp.src("./source/*.html")
		.pipe(twig({
			data: data
		}))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("./build"));
}

export function validateMarkup () {
  return gulp.src("./source/*.html")
  .pipe(twig({
    data: data
  }))
  .pipe(gulp.dest("./build"))
  .pipe(htmlValidator.analyzer())
  .pipe(htmlValidator.reporter());
}

export function buildingStyles () {
	return gulp.src("source/css/styles.css")
		.pipe(plumber())
		.pipe(postcss(() => ({
			plugins: [
				postImport(),
				postMediaMinMax(),
				postCustomMedia(),
				postNested(),
				autoprefixer(),
				postCsso()
			],
		})))
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(gulp.dest("build/css"))
		.pipe(browser.stream());
}

export function buildingLibStyles () {
	return gulp.src([
			"./node_modules/swiper/swiper-bundle.min.css"
		])
		.pipe(gulp.dest("./build/css/libs/"));
}

export function buildingScripts () {
	return gulp.src("./source/js/*.js")
		.pipe(concat('scripts.js'))
		.pipe(terser())
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(gulp.dest("./build/js"))
		.pipe(browser.stream());
}

export function buildingLibScripts () {
	return gulp.src([
			"./node_modules/svg4everybody/dist/svg4everybody.min.js",
			"./node_modules/swiper/swiper-bundle.min.js"
		])
		.pipe(gulp.dest("./build/js/libs"));
}

export function optimizeImages () {
	return gulp.src("./source/img/**/*.{png,jpg}")
		.pipe(squoosh())
		.pipe(gulp.dest("build/img"))
}

export function copyImages () {
	return gulp.src("./source/img/**/*")
		.pipe(gulp.dest("build/img"))
}

export function createWebp () {
	return gulp.src("./source/img/**/*.{jpg,png}")
		.pipe(
			squoosh({
				webp: {}
			})
		)
		.pipe(gulp.dest("./build/img"))
}

export function createAvif () {
	return gulp.src("./source/img/**/*.{jpg,png}")
		.pipe(
			squoosh({
				avif: {}
			})
		)
		.pipe(gulp.dest("./build/img"))
}

export function createSprite () {
	return gulp.src("./source/icons/*.svg")
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			},
		}
		))
		.pipe(gulp.dest("./build/icons"));
}

export function copyAssets (done) {
	gulp.src([
		"./source/fonts/**/*",
		"./source/*.ico",
		"./source/images/**/*.svg",
		"./source/favicons/*",
		"./source/*.webmanifest"
	], {
		base: "./source"
	})
		.pipe(gulp.dest("./build"))
	done();
}

export function removeBuild () {
	return del("./build");
};

export function startServer (done) {
	browser.init({
		server: {
			baseDir: "./build"
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done();
}

function reloadServer (done) {
  browser.reload();
  done();
}

function watchFiles () {
	gulp.watch("./source/css/**/*.css", gulp.series(buildingStyles));
	gulp.watch("./source/scripts/**/*.js", gulp.series(buildingScripts, reloadServer));
	gulp.watch(["./source/**/*.{html,twig}", "./source/data/data.js"], gulp.series(buildingViews, reloadServer));
	gulp.watch("./source/icons/**/*.svg", gulp.series(createSprite, reloadServer));
}

export const build = gulp.series(
	removeBuild,
	gulp.parallel(
		buildingStyles,
		buildingLibStyles,
		buildingViews,
		buildingLibScripts,
		buildingScripts,
		createSprite,
		copyAssets,
		optimizeImages,
		// createWebp,
		// createAvif
	)
);

// Development build

export default gulp.series(
	removeBuild,
	gulp.parallel(
		buildingStyles,
		buildingLibStyles,
		buildingViews,
		buildingLibScripts,
		buildingScripts,
		createSprite,
		copyAssets,
		copyImages,
		// createWebp,
		// createAvif
	),
	gulp.series(
		startServer,
		watchFiles
	)
);
