(function() {
  const e = React.createElement;
  const { Link, useParams } = ReactRouterDOM;

  window.PostDetail = function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = React.useState(null);
    React.useEffect(function() {
      fetch(`/posts/${id}.json`)
        .then(function(resp) { return resp.json(); })
        .then(function(data) { setPost(data); });
    }, [id]);

    if (!post) return e('p', null, 'Loading...');
    return e('div', { className: 'card' },
      e('h2', { className: 'text-xl font-semibold' }, post.title),
      e('p', { className: 'mt-2 text-gray-700' }, post.body),
      e(Link, { to: '/' }, 'Back')
    );
  };
})();
