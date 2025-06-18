(function() {
  const e = React.createElement;

  window.NotificationList = function NotificationList() {
    const [notes, setNotes] = React.useState([]);
    React.useEffect(function() {
      fetch('/notifications.json')
        .then(function(resp) { return resp.json(); })
        .then(function(data) { setNotes(data); });
    }, []);

    return e(React.Fragment, null,
      notes.map(function(note) {
        return e('div', { className: 'card mb-4', key: note.id },
          e('p', null, note.message)
        );
      })
    );
  };
})();
