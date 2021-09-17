let currentUserId = '';
function addNewContact() {
  $('.add-new-contact').bind('click', function () {
    let element = $(this);
    let targetId = $(this).data('uid');
    currentUserId = targetId;
    $.post('/contact/add-new', { uid: targetId }, function (data) {
      if (data.success) {
        $('.company-up-info')
          .find(`a.add-new-contact[data-uid = ${targetId}]`)
          .hide();
        $('.company-up-info')
          .find(`a.remove-request-contact[data-uid = ${targetId}]`)
          .css({ display: 'inline-block' });

        // Send event to server with socket io
        socket.emit('add-new-contact', { contactId: targetId });

        // Receive information about request confirmation of user
        socket.on('response-confirm-accept-request-to-contact', function(res){
          element.remove();
        });
        socket.on('response-confirm-reject-request-to-contact', function(res){
          $('.company-up-info')
          .find(`a.add-new-contact[data-uid = ${targetId}]`)
          .css({ display: 'inline-block' });
        $('.company-up-info')
          .find(`a.remove-request-contact[data-uid = ${targetId}]`)
          .hide();
        });
      }
    });
  });
}

socket.on('response-add-new-contact', function (user) {
  let notif = `<div class="notfication-details" data-uid="${user.id}" style="background: aquamarine; cursor: pointer;">
                <div class="noty-user-img">
                  <img src="images/User/${user.avatar}" alt="" />
                </div>
                <div class="notification-info">
                  <h3>
                    <a href="#" title="">${user.fullname}</a>
                  </h3>
                  <p>
                    Send you a friend request
                  </p>
                  <span>1 min ago</span>
                </div>
                <!--notification-info -->
              </div>
              `;
  $('#notification-info-scrollbar').prepend(notif);
  readNotification(currentUserId);
});
