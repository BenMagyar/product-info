'use strict';

var expect = require('expect.js');
var producer = require('product-info');

describe('parser setup', function(){

  it('should allow for HTML for an input', function(done){
    producer.parse('<html><body><h1>test</h1></body></html>', function(err, product){
      expect(err).to.be(null);
      done();
    });
  });
  it('should allow for a URL as an input', function(done){
    producer.parse('http://google.com', function(err, product){
      expect(err).to.be(null);
      done();
    });
  });

});
