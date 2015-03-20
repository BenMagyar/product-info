'use-strict';

var jsdom = require('jsdom'),
    schema = require('./schema.org.js'),
    generic = require('./generic.js'),
    URLRegExp = require('url-regexp');

// Parse HTML or URL into a product object
module.exports.parse = function(data, callback) {

  var parseHTML = function(html) {

    // Schema.org, should never be forced
    if (html.indexOf('http://schema.org/Product') > -1) {
      schema.parse(html, callback);
    } else {
      generic.parse(html, callback);
    }

  };

  // Fetch data when URL
  if (URLRegExp.validate(data)) {
    // Get HTML For parsing
    // We need to use jsdom for this request so all <script> tags can run
    // for websites that are not static :(
    jsdom.env({
      url: data,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'},
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
      },
      done: function(errors, window) {
        parseHTML(window.document.documentElement.innerHTML);
      }
    });
  } else {
    parseHTML(data);
  }

};
