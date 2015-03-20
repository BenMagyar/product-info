/*jshint expr: true*/
'use strict';

var expect = require('expect.js');
var producer = require('product-info');

describe('schema.org markup', function(){

  it('should correctly scrape a full product', function(done){
    var HTML = '' +
      '<html>' +
      '  <head>' +
      '    <title></title>' +
      '  </head>' +
      '  <body>' +
      '    <div itemscope itemtype="http://schema.org/Product">' +
      '      <span itemprop="name" style="display:none">Not Our Product</span>' +
      '      <span itemprop="name">Product Name</span>' +
      '      <span itemprop="description">Product Description</span>' +
      '      <link itemprop="availability" href="http://schema.org/InStock"/>' +
      '      <ul itemprop="offers">' +
      '        <li itemprop="price">' +
      '          <meta itemprop="priceCurrency" content="USD">' +
      '          <strong>99</strong>.99' +
      '        </li>' +
      '      </ul>' +
      '    </div>' +
      '  </body>' +
      '</html>';
    producer.parse(HTML, function(err, product) {

      expect(err).to.be(null);
      expect(product.name).to.equal('Product Name');
      expect(product.description).to.equal('Product Description');
      expect(product.offers.price).to.equal('99.99');
      expect(product.offers.priceCurrency).to.equal('USD');
      expect(product.offers.availability).to.equal('InStock');
      done();

    });
  });

});
