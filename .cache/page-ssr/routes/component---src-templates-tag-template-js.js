"use strict";
exports.id = 51;
exports.ids = [51];
exports.modules = {

/***/ 2505:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* reexport */ Pagination_Pagination)
});

// EXTERNAL MODULE: external "/Users/murtazabagwala/workspace/my personal blog/murtaza-bagwala.github.io 2/node_modules/react/index.js"
var index_js_ = __webpack_require__(4823);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ./node_modules/classnames/bind.js
var bind = __webpack_require__(7967);
var bind_default = /*#__PURE__*/__webpack_require__.n(bind);
// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js + 11 modules
var gatsby_browser_entry = __webpack_require__(4666);
// EXTERNAL MODULE: ./src/constants/index.js + 2 modules
var constants = __webpack_require__(7257);
;// ./src/components/Pagination/Pagination.module.scss
// Exports
/* harmony default export */ const Pagination_module = ({
	"pagination": "Pagination-module--pagination--d61cb",
	"pagination__prev": "Pagination-module--pagination__prev--c31b0",
	"paginationPrev": "Pagination-module--pagination__prev--c31b0",
	"pagination__prev-link": "Pagination-module--pagination__prev-link--949b1",
	"paginationPrevLink": "Pagination-module--pagination__prev-link--949b1",
	"pagination__prev-link--disable": "Pagination-module--pagination__prev-link--disable--351f0",
	"paginationPrevLinkDisable": "Pagination-module--pagination__prev-link--disable--351f0",
	"pagination__next": "Pagination-module--pagination__next--22ed3",
	"paginationNext": "Pagination-module--pagination__next--22ed3",
	"pagination__next-link": "Pagination-module--pagination__next-link--1f772",
	"paginationNextLink": "Pagination-module--pagination__next-link--1f772",
	"pagination__next-link--disable": "Pagination-module--pagination__next-link--disable--fa7b1",
	"paginationNextLinkDisable": "Pagination-module--pagination__next-link--disable--fa7b1"
});

;// ./src/components/Pagination/Pagination.js
const cx=bind_default().bind(Pagination_module);const Pagination=({prevPagePath,nextPagePath,hasNextPage,hasPrevPage})=>{const prevClassName=cx({'pagination__prev-link':true,'pagination__prev-link--disable':!hasPrevPage});const nextClassName=cx({'pagination__next-link':true,'pagination__next-link--disable':!hasNextPage});return/*#__PURE__*/index_js_default().createElement("div",{className:Pagination_module['pagination']},/*#__PURE__*/index_js_default().createElement("div",{className:Pagination_module['pagination__prev']},/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{rel:"prev",to:hasPrevPage?prevPagePath:'/',className:prevClassName},constants/* PAGINATION */.B.PREV_PAGE)),/*#__PURE__*/index_js_default().createElement("div",{className:Pagination_module['pagination__next']},/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{rel:"next",to:hasNextPage?nextPagePath:'/',className:nextClassName},constants/* PAGINATION */.B.NEXT_PAGE)));};/* harmony default export */ const Pagination_Pagination = (Pagination);
;// ./src/components/Pagination/index.js


/***/ }),

/***/ 4737:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* reexport */ Feed_Feed)
});

// EXTERNAL MODULE: external "/Users/murtazabagwala/workspace/my personal blog/murtaza-bagwala.github.io 2/node_modules/react/index.js"
var index_js_ = __webpack_require__(4823);
var index_js_default = /*#__PURE__*/__webpack_require__.n(index_js_);
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(5093);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ./.cache/gatsby-browser-entry.js + 11 modules
var gatsby_browser_entry = __webpack_require__(4666);
;// ./src/components/Feed/Feed.module.scss
// Exports
/* harmony default export */ const Feed_module = ({
	"feed__item": "Feed-module--feed__item--619ca",
	"feedItem": "Feed-module--feed__item--619ca",
	"feed__item-title": "Feed-module--feed__item-title--3920d",
	"feedItemTitle": "Feed-module--feed__item-title--3920d",
	"feed__item-title-link": "Feed-module--feed__item-title-link--37758",
	"feedItemTitleLink": "Feed-module--feed__item-title-link--37758",
	"feed__item-description": "Feed-module--feed__item-description--be821",
	"feedItemDescription": "Feed-module--feed__item-description--be821",
	"feed__item-meta-time": "Feed-module--feed__item-meta-time--a7603",
	"feedItemMetaTime": "Feed-module--feed__item-meta-time--a7603",
	"feed__item-meta-divider": "Feed-module--feed__item-meta-divider--d0e09",
	"feedItemMetaDivider": "Feed-module--feed__item-meta-divider--d0e09",
	"feed__item-meta-category-link": "Feed-module--feed__item-meta-category-link--0d2d9",
	"feedItemMetaCategoryLink": "Feed-module--feed__item-meta-category-link--0d2d9",
	"feed__item-readmore": "Feed-module--feed__item-readmore--3a66e",
	"feedItemReadmore": "Feed-module--feed__item-readmore--3a66e"
});

;// ./src/components/Feed/Feed.js
const Feed=({edges})=>/*#__PURE__*/index_js_default().createElement("div",{className:Feed_module['feed']},edges.map(edge=>/*#__PURE__*/index_js_default().createElement("div",{className:Feed_module['feed__item'],key:edge.node.fields.slug},/*#__PURE__*/index_js_default().createElement("div",{className:Feed_module['feed__item-meta']},/*#__PURE__*/index_js_default().createElement("time",{className:Feed_module['feed__item-meta-time'],dateTime:moment_default()(edge.node.frontmatter.date).format('MMMM D, YYYY')},moment_default()(edge.node.frontmatter.date).format('MMMM YYYY')),/*#__PURE__*/index_js_default().createElement("span",{className:Feed_module['feed__item-meta-divider']}),/*#__PURE__*/index_js_default().createElement("span",{className:Feed_module['feed__item-meta-category']},/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{to:edge.node.fields.categorySlug,className:Feed_module['feed__item-meta-category-link']},edge.node.frontmatter.category))),/*#__PURE__*/index_js_default().createElement("h2",{className:Feed_module['feed__item-title']},/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{className:Feed_module['feed__item-title-link'],to:edge.node.fields.slug},edge.node.frontmatter.title)),/*#__PURE__*/index_js_default().createElement("p",{className:Feed_module['feed__item-description']},edge.node.frontmatter.description),/*#__PURE__*/index_js_default().createElement(gatsby_browser_entry.Link,{className:Feed_module['feed__item-readmore'],to:edge.node.fields.slug},"Read"))));/* harmony default export */ const Feed_Feed = (Feed);
;// ./src/components/Feed/index.js


/***/ }),

/***/ 7447:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4823);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8617);
/* harmony import */ var _components_Sidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1094);
/* harmony import */ var _components_Feed__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4737);
/* harmony import */ var _components_Page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4369);
/* harmony import */ var _components_Pagination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2505);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6095);
const TagTemplate=({data,pageContext})=>{const{title:siteTitle,subtitle:siteSubtitle}=(0,_hooks__WEBPACK_IMPORTED_MODULE_6__/* .useSiteMetadata */ .Q6)();const{tag,currentPage,prevPagePath,nextPagePath,hasPrevPage,hasNextPage}=pageContext;const{edges}=data.allMarkdownRemark;const pageTitle=currentPage>0?`All Posts tagged as "${tag}" - Page ${currentPage} - ${siteTitle}`:`All Posts tagged as "${tag}" - ${siteTitle}`;return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Layout__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{title:pageTitle,description:siteSubtitle},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Sidebar__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,null),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Page__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A,{title:tag},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Feed__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,{edges:edges}),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Pagination__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A,{prevPagePath:prevPagePath,nextPagePath:nextPagePath,hasPrevPage:hasPrevPage,hasNextPage:hasNextPage})));};const query="3304848659";/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TagTemplate);

/***/ })

};
;
//# sourceMappingURL=component---src-templates-tag-template-js.js.map