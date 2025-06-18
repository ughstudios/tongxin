(function() {
  const e = React.createElement;

  window.CartView = function CartView() {
    const [items, setItems] = React.useState([]);
    React.useEffect(function() {
      fetch('/cart.json')
        .then(function(resp) { return resp.json(); })
        .then(function(data) { setItems(data.cart_items || []); });
    }, []);

    function removeItem(id) {
      fetch(`/cart_items/${id}.json`, { method: 'DELETE' })
        .then(function() {
          setItems(items.filter(function(it) { return it.id !== id; }));
        });
    }

    return e(React.Fragment, null,
      items.map(function(item) {
        return e('div', { className: 'card mb-4', key: item.id },
          e('h2', { className: 'text-xl font-semibold' }, item.product.name),
          e('p', { className: 'mt-2 text-gray-700' }, `Qty: ${item.quantity}`),
          e('button', {
            className: 'mt-2 text-red-600',
            onClick: function() { removeItem(item.id); }
          }, 'Remove')
        );
      })
    );
  };
})();
