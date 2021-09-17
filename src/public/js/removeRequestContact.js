function removeRequestContact() {
  $('.remove-request-contact').bind('click', function () {
    let targetId = $(this).data('uid');
    $.ajax({
      url: '/remove-request-contact',
      type: 'DELETE',
      data: { uid: targetId },
      success: function (res) {
        if (res.success) {
          $('.company-up-info')
            .find(`a.remove-request-contact[data-uid = ${targetId}]`)
            .hide();
          $('.company-up-info')
            .find(`a.add-new-contact[data-uid = ${targetId}]`)
            .css({ display: 'inline-block' });

          socket.emit('remove-request-contact', { contactId: targetId });
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
}

socket.on('response-remove-request-contact', function (user) {
  $('#notification-info-scrollbar').find(`div[data-uid = ${user.id}]`).remove();
});
