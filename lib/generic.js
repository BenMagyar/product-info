'use strict';

var cheerio   = require('cheerio'),
    // Our naming ids and tags, this should later be dynamic and adapt to correct
    // choices later on
    nameSelectors = ['#productTitle'],
    // Our "hierarchy" of importance
    hierarchy = ['h1','h2','h3','h4','h5','b','span','p','body'],
    // Mapping for currencies
    currencies = { '$': 'USD', '£': 'GBP' },
    // URL Regex
    ValidURLs = /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/;

// Parsing generic websites with a best guess approach
module.exports.parse = function(html, callback) {


  var $ = cheerio.load(html),
      product = {};

  // NAME
  // Find the name based off a set hierarchy we can use the title as a reference
  // to possibly find it easier
  var title = $('title').text();
  if (title !== null && title !== '') {
    // Strip the title of the domain name
    title = title.replace(ValidURLs,'');
    // Take everything up to the first comma
    title = title.substr(0, title.indexOf(','));
    // Check the body if there is a match if so set that
    if ($('body').html().indexOf(title) > -1) {
      product.name = title;
    }
  }
  // Only fall back on the hierarchy if the title did not work
  var selectors = nameSelectors.concat(hierarchy);
  selectors.some(function(type, i){
    // TODO Use context to adapt search
    var element = $(type).first();
    if (element !== undefined && $(element).text().replace(/[\t\r\n\f]/g, '').trim() !== '') {
      product.name = $(element).text().replace(/[\t\r\n\f]/g, '').trim();
      return true;
    }
    return false;
  });
  // If all else fails return null
  if (product.name === undefined ) { product.name = null; }

  // PRICE
  // Find price based on a set hierarchy and then just giving up and finding a $
  hierarchy.some(function(type, i){
    var matches = $(type).filter(function(j, element){
      return ($(this).html().match(/[$£][0-9]+.{0,1}[0-9]{0,2}/) || []).length > 0;
    });
    if (matches.length > 0) {
      var match = $(matches[0]).html().match(/([$£])([0-9]+.{0,1}[0-9]{0,2})/);
      product.offers = {
        price: match[2],
        priceCurrency: currencies[match[1]]
      };
      return true;
    } else {
      return false;
    }
  });
  if (product.offers === undefined) { product.offers = { price: null, priceCurrency: null }; }

  // DESCRIPTION
  // TODO look for similar content based off of name

  callback(null, product);

};
