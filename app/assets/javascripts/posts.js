(function() {
  const e = React.createElement;
  const { Link } = ReactRouterDOM;

  window.PostList = function PostList() {
    const [posts, setPosts] = React.useState([]);
    React.useEffect(function() {
      fetch('/posts.json')
        .then(function(resp) { return resp.json(); })
        .then(function(data) { setPosts(data); });
    }, []);

    return e(React.Fragment, null,
      posts.map(function(post) {
        return e('div', { className: 'card mb-4', key: post.id },
          e(Link, { to: `/posts/${post.id}` },
            e('h2', { className: 'text-xl font-semibold' }, post.title)
          ),
          e('p', { className: 'mt-2 text-gray-700' }, post.body)
        );
      })
    );
  };
})();
