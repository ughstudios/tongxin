(function() {
  const e = React.createElement;

  window.VideoList = function VideoList() {
    const [videos, setVideos] = React.useState([]);
    React.useEffect(function() {
      fetch('/videos.json')
        .then(function(resp) { return resp.json(); })
        .then(function(data) { setVideos(data); });
    }, []);

    return e(React.Fragment, null,
      videos.map(function(video) {
        return e('div', { className: 'card mb-4', key: video.id },
          e('h2', { className: 'text-xl font-semibold' }, video.title)
        );
      })
    );
  };
})();
