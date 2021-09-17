let countMessage = 0;
function listenToClick(el) {
  let id = $(el).attr('id').replace('message_', '');
  readMessage(id);
  $(el)
    .unbind('keyup')
    .bind('keyup', function (e) {
      if (e.which == 13) {
        $(el).closest('button').click();
      }
    });
}

function readMessage(userId) {
  countMessage = 0;
  let data = {
    userId: userId,
  };
  $.ajax({
    url: '/read-message',
    type: 'PUT',
    data: data,
    success: function (res) {
      let dataTarget = '#to_' + userId;
      $(`li[data-target = '${dataTarget}'] .msg-notifc`).text('0');
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function getTextMessageAndEmoji(userId) {
  let idMessage = '#message_' + userId;
  let message = $(idMessage).val();
  if (message.length == 0) return false;
  let messageForSend = {
    uid: userId,
    message: message,
  };
  $.post('/message/add-new', messageForSend, function (data) {
    //success
    let dataForEmit = {
      message: data.msg,
      contactId: userId,
    };
    let time = new Date();
    let convertTime = moment(time).locale('vi').startOf('seconds').fromNow();
    let messageElement = `<div
                          class="main-message-box ta-right"
                          data-mess-id="${data.msg._id}"
                        >
                          <div
                            class="message-dt"
                          >
                            <div class="message-inner-dt">
                              <p>${data.msg.text}</p>
                            </div>
                            <span>${convertTime}</span>
                          </div>
                          <div class="messg-usr-img">
                            <img
                              src="images/User/${data.msg.sender.avatar}"
                              alt=""
                              style="height: 50px; width: 50px; object-fit: cover"
                            />
                          </div>
                        </div>`;
    $(
      `.messages-line[data-chat = ${data.msg.receiverId}] .mCustomScrollBox .mCSB_container`
    ).append(messageElement);

    let notifyMessage = `<div class="usr-msg-details">
                          <div class="usr-ms-img">
                            <img
                              src="images/User/${data.msg.receiver.avatar}"
                              alt=""
                              style="height: 50px; width: 50px; object-fit: cover"
                            />
                            <span class="msg-status"></span>
                          </div>
                          <div class="usr-mg-info">
                            <h3>${data.msg.receiver.username}</h3>
                            <p
                              style="
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                width: 140px;
                              "
                            >
                              You sent: ${data.msg.text}
                            </p>
                          </div>
                          <span class="posted_time">
                            ${convertTime}
                          </span>
                          <span class="msg-notifc">0</span>
                        </div>`;

    let idListChatItem = '#to_' + data.msg.receiverId;
    $(
      `.list-chat-item[data-target = '${idListChatItem}'] .usr-msg-details`
    ).remove();
    $(`.list-chat-item[data-target = '${idListChatItem}']`).append(
      notifyMessage
    );
    $(`.list-chat-item[data-target = '${idListChatItem}']`)
      .closest('ul')
      .prepend($(`.list-chat-item[data-target = '${idListChatItem}']`));
    scrollToEnd(true);
    $(idMessage).val('');
    $(idMessage).focus();

    // Emit socket
    socket.emit('chat-text-emoji', dataForEmit);
  }).fail(function (error) {
    //fail
    alertify.error(error);
  });
}

socket.on('response-chat-text-emoji', function (data) {
  countMessage++;
  let time = new Date();
  let convertTime = moment(time).locale('vi').startOf('seconds').fromNow();
  let messageElement = `<div
                          class="main-message-box st3"
                          data-mess-id="${data.message._id}"
                        >
                          <div
                            class="message-dt st3"
                          >
                            <div class="message-inner-dt">
                              <p>${data.message.text}</p>
                            </div>
                            <span>${convertTime}</span>
                          </div>
                          <div class="messg-usr-img">
                            <img
                              src="images/User/${data.message.sender.avatar}"
                              alt=""
                              style="height: 50px; width: 50px; object-fit: cover"
                            />
                          </div>
                        </div>`;
  $(
    `.messages-line[data-chat = ${data.message.senderId}] .mCustomScrollBox .mCSB_container`
  ).append(messageElement);

  let notifyMessage = `<div class="usr-msg-details">
                          <div class="usr-ms-img">
                            <img
                              src="images/User/${data.message.sender.avatar}"
                              alt=""
                              style="height: 50px; width: 50px; object-fit: cover"
                            />
                            <span class="msg-status"></span>
                          </div>
                          <div class="usr-mg-info">
                            <h3>${data.message.sender.username}</h3>
                            <p
                              style="
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                width: 140px;
                              "
                            >
                              ${data.message.text}
                            </p>
                          </div>
                          <span class="posted_time">
                            ${convertTime}
                          </span>
                          <span class="msg-notifc">${countMessage}</span>
                        </div>`;

  let idListChatItem = '#to_' + data.message.senderId;
  $(
    `.list-chat-item[data-target = '${idListChatItem}'] .usr-msg-details`
  ).remove();
  $(`.list-chat-item[data-target = '${idListChatItem}']`).append(notifyMessage);
  $(`.list-chat-item[data-target = '${idListChatItem}']`)
    .closest('ul')
    .prepend($(`.list-chat-item[data-target = '${idListChatItem}']`));
  scrollToEnd(true);
});
