(function() {
  const e = React.createElement;

  window.ProductList = function ProductList() {
    const [products, setProducts] = React.useState([]);
    React.useEffect(function() {
      fetch('/products.json')
        .then(function(resp) { return resp.json(); })
        .then(function(data) { setProducts(data); });
    }, []);

    function addToCart(id) {
      fetch('/cart_items.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: id })
      });
    }

    return e('div', { className: 'product-grid' },
      products.map(function(prod) {
        return e('div', { className: 'card', key: prod.id },
          e('h2', { className: 'text-xl font-semibold' }, prod.name),
          e('p', { className: 'mt-2 text-gray-700' }, `$${prod.price}`),
          e('button', {
            className: 'mt-2 text-blue-600',
            onClick: function() { addToCart(prod.id); }
          }, 'Add to Cart')
        );
      })
    );
  };
})();
