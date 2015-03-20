/*jshint expr: true*/
'use strict';

var producer = require('product-info'),
    expect   = require('expect.js');

describe('generic markup', function(){

  describe('name scraping', function(){
    it('should return null when no name exists', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '    <title></title>' +
        '  </head>' +
        '  <body>' +
        '    <div></div>' +
        '  </body>' +
        '</html>';
      producer.parse(HTML, function(err, product) {
        expect(product.name).to.be(null);
        done();
      });
    });

    it('should search through the title for the name first', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '    <title>Amazon.com - Blue Shirt, Clothing</title>' +
        '  </head>' +
        '  <body>' +
        '    <div>Blue Shirt</div>' +
        '  </body>' +
        '</html>';
      producer.parse(HTML, function(err, product){
        expect(product.name).to.equal('Blue Shirt');
        done();
      });
    });

    it('should first search for extended class/id selectors', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '  </head>' +
        '  <body>' +
        '    <h1>Green Shirt</h1>' +
        '    <span id="productTitle">Blue Shirt</span>' +
        '  </body>' +
        '</html>';
      producer.parse(HTML, function(err, product){
        expect(product.name).to.equal('Blue Shirt');
        done();
      });
    });

    it('should follow the hierarchy if no title exists', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '  </head>' +
        '  <body>' +
        '    <h2>Green Shirt</h2>' +
        '    <h1>Blue Shirt</h1>' +
        '  </body>' +
        '</html>';
      producer.parse(HTML, function(err, product){
        expect(product.name).to.equal('Blue Shirt');
        done();
      });
    });
  });

  describe('price scraping', function(){

    it('should return null when no price exists', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '    <title></title>' +
        '  </head>' +
        '  <body>' +
        '    <h3>Product Name</h3>' +
        '  </body>' +
        '</html>';
      producer.parse(HTML, function(err, product) {
        expect(product.offers.price).to.equal(null);
        expect(product.offers.priceCurrency).to.equal(null);
        done();
      });
    });

    it('should correctly go off the hierarchy', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '    <title></title>' +
        '  </head>' +
        '  <body>' +
        '    <h3>$15.55</h3>' +
        '    <h1 class="item-name">Product Name</h1>' +
        '    <h2>$43.23 <strike>$15.22</strike>/h2>' +
        '  </body>' +
        '</html>';
      producer.parse(HTML, function(err, product) {
        expect(product.offers.price).to.equal('43.23');
        expect(product.offers.priceCurrency).to.equal('USD');
        done();
      });
    });

    it('should take the first result if there is a hierarchy match', function(done){
      var HTML = '' +
        '<html>' +
        '  <head>' +
        '    <title></title>' +
        '  </head>' +
        '  <body>' +
        '    <h3>$15.55</h3>' +
        '    <h3>$43.23 <strike>$15.22</strike>/h2>' +
        '  </body>' +
        '</html>';
      producer.parse('HTML', function(err, product) {
        expect(product.offers.price).to.equal('15.55');
        expect(product.offers.priceCurrency).to.equal('USD');
        done();
      });
    });

  });

  describe('description scraping', function() {

  });

});
