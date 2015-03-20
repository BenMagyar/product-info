# product-info

Extracts limited product information for a given web page.

## Limitations

Current implementation is crude with generic (non-schema.org) websites
being limited to only `name` and `price` information.

When a URL is provided the page is opened in [jsdom](https://github.com/tmpvar/jsdom),
and is set to fetch and process external `script` tags. To skip this pass in the
HTML of the page instead.

## Installation

`npm install product-info`

## Return

A javascript object is returned with a similar structure to the
[schema.org product schema](http://schema.org/Product); however, canonical
references were removed.

#### Example

```
// Returned
{
  name: 'Blue Shirt',
  description: 'A blue colored shirt',
  offers: {
    price: '20.00',
    priceCurrency: 'USD',
    availability: 'InStock'
  }
}
```

## Methods

### Parser
#### parser(HTML, callback)
Method for parsing HTML into a product.

```
producer.parse('http://my-schema-url.org', function(err, product){
  // product returned
});
```

#### parser(URL, callback)
Method for parsing a URL into a product. Waits until all external
script tags are fetched and have run.

```
producer.parse('http://my-schema-url.org', function(err, product){
  // product returned
});
```
