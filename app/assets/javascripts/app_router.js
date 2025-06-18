(function() {
  const e = React.createElement;
  const { BrowserRouter, Routes, Route, Link } = ReactRouterDOM;

  window.App = function App() {
    return e(BrowserRouter, null,
      e('div', { className: 'content-wrapper' },
        e('h1', { className: 'text-3xl font-bold mb-6 text-center' }, 'TongXin'),
        e('nav', { className: 'nav-bar' },
          e(Link, { to: '/' }, 'Home'),
          e(Link, { to: '/trending' }, 'Trending'),
          e(Link, { to: '/videos' }, 'Videos'),
          e(Link, { to: '/products' }, 'Products'),
          e(Link, { to: '/cart' }, 'Cart'),
          e(Link, { to: '/notifications' }, 'Notifications')
        ),
        e(Routes, null,
          e(Route, { path: '/', element: e(PostList) }),
          e(Route, { path: '/trending', element: e(TrendingList) }),
          e(Route, { path: '/videos', element: e(VideoList) }),
          e(Route, { path: '/products', element: e(ProductList) }),
          e(Route, { path: '/cart', element: e(CartView) }),
          e(Route, { path: '/notifications', element: e(NotificationList) }),
          e(Route, { path: '/posts/:id', element: e(PostDetail) })
        )
      )
    );
  };

  document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.createRoot(document.getElementById('spa')).render(e(App));
  });
})();
