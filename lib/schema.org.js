// Parsing Schema.org
'use strict';

var cheerio = require('cheerio');

// Extracts microdata from pages using Schema.org microdata markup
module.exports.parse = function(html, callback) {

  var $ = cheerio.load(html);

  // Extend cheerio to extract metadata
  $.prototype.metadata = function(property) {

    var elements = $(this).find('[itemprop=' + property + ']');
    if (elements.length === 0) { return null; }
    var element = elements.filter(function(i, element){
      // Remove hidden elements
      return $(this).attr('style') !== undefined && $(this).attr('style').replace(/\s/g, '').indexOf('display:none') > -1 ? false : true;
    })[0];

    // Return the contents of the microdata based on tag type
    switch (element.name) {
      case 'meta' || $(element).attr('content') !== undefined:
        return $(element).attr('content') !== undefined ? $(element).attr('content') : null;
      case 'link':
        // link tags contain the link to the actual schema type but this is not
        // JSONLD so return only the trailing section
        var href = $(element).attr('href');
        return href !== undefined ? href.substr(href.lastIndexOf('/') + 1) : null;
      default:
        return $(element).text() !== undefined ? $(element).text().replace(/[\t\r\n\f]/g, '').trim() : null;
    }

  };

  // Find the product with the most properties attached
  var products = $('[itemscope][itemtype="http://schema.org/Product"]'),
      primary = { count: 0 };

  products.each(function(i, element) {
    var count = $(this).find('[itemprop]').length;
    if (count > primary.count) {
      primary = {
        element: $(this),
        count: count
      };
    }
  });

  // Extract the required properties for the returned element
  // This is NOT JSONLD even though we are extracting microdata
  var product = {
      name: primary.element.metadata('name'),
      description: primary.element.metadata('description'),
      offers: {
        price: primary.element.metadata('price'),
        priceCurrency: primary.element.metadata('priceCurrency'),
        availability: primary.element.metadata('availability')
      }
  };

  // Return with our product in hand
  callback(null, product);

};
