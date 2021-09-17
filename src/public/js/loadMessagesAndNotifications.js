function loadAllNotifications(notificationStr) {
  let notificationArr = notificationStr.split(',');
  notificationArr.forEach((item) => {
    item = item.replace(/\\/g, '');
    $('#notification-info-scrollbar').prepend(item);
  });
}
function readNotification(userId) {
  $('#notification-info-scrollbar .notfication-details').bind(
    'click',
    function () {
      let target = $(this);
      let contactId = target.data('uid');
      let type = target.attr('class').split(/\s+/)[1];
      let data = {
        userId: userId,
        contactId: contactId,
        type: type,
      };
      $.ajax({
        url: '/read-notification',
        type: 'PUT',
        data: data,
        success: function (res) {
          if (res) {
            target.css({ background: 'white' });
          }
          document.location.href = '/friend-requests';
        },
        error: function (err) {
          console.log(err);
        },
      });
    }
  );
}
