function videoChat() {
  $('.video-chat')
    .unbind('click')
    .on('click', function () {
      $('.video-chat-container').show();
      let targetId = $(this).data('chat');
      let callerName = $('#username-common-head').text();

      // Data for emit
      let dataForEmit = {
        listenerId: targetId,
        callerName: callerName,
      };

      // Step 1: check user online
      socket.emit('caller-check-listener-online', dataForEmit);
    });
}
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
}
function stopStreamVideo(video) {
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    if (tracks) {
      tracks.forEach(function (track) {
        track.stop();
      });
    }
    video.srcObject = null;
  }
}

$(document).ready(function () {
  videoChat();
  $('.end-call-video').on('click', function () {
    $('.video-chat-container').hide();
    let video = document.getElementById('my-camera');
    let videoPeer = document.getElementById('peer-camera');
    stopStreamVideo(video);
    stopStreamVideo(videoPeer);
  });
  // Step 2: Listener offline
  socket.on('server-inform-listener-offline', function () {
    setTimeout(function () {
      $('.video-chat-container').hide();
      alertify.warning('Your friend is offline.');
    }, 2000);
  });
  // Step 3: request peerId of listener
  let getPeerId = '';
  const peer = new Peer();
  peer.on('open', function (peerId) {
    getPeerId = peerId;
  });

  socket.on('server-request-peer-id-of-listener', function (res) {
    let listenerName = $('#username-common-head').text();
    let dataForEmit = {
      callerId: res.callerId,
      listenerId: res.listenerId,
      callerName: res.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId,
    };

    // Step 4: Listener emit data for server
    socket.emit('listener-emit-peer-id-to-server', dataForEmit);
  });

  // Step 5: Server send peer id of listener to caller
  socket.on('server-send-peer-id-of-listener-to-caller', function (res) {
    let dataForEmit = {
      callerId: res.callerId,
      listenerId: res.listenerId,
      callerName: res.callerName,
      listenerName: res.listenerName,
      listenerPeerId: res.listenerPeerId,
    };

    // Step 6: Caller request call action to server
    socket.emit('caller-request-call-action-to-server', dataForEmit);

    $.getScript('//cdn.jsdelivr.net/npm/sweetalert2@10', function () {
      let timerInterval;
      Swal.fire({
        title: `You are calling ${res.listenerName} &nbsp; <i class="fa fa-volume-control-phone"></i>`,
        html: `Time: <strong style="color: #d43f3a"></strong> s <br/><br/>
                <button id="btn-cancel-call" class="btn btn-danger" style="cursor: pointer;">Cancel call</button>`,
        timer: 30000,
        //timerProgressBar: true,
        allowOutsideClick: false,
        onBeforeOpen: () => {
          $('#btn-cancel-call')
            .unbind('click')
            .on('click', function () {
              Swal.close();
              clearInterval(timerInterval);

              // Step 7: Caller cancel request call to listener
              socket.emit('caller-cancel-request-call-to-server', dataForEmit);
            });
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector('strong').textContent = Math.ceil(
              Swal.getTimerLeft() / 1000
            );
          }, 1000);
        },
        onOpen: () => {
          // Step 12: Server send reject request call to caller
          socket.on('server-send-reject-call-to-caller', function (res) {
            Swal.close();
            $('.video-chat-container').hide();
            clearInterval(timerInterval);

            alertify.warning('Your call has been rejected, please try later.');
          });

          // Step 13: Server send accept request call to caller
          socket.on('server-send-accept-call-to-caller', async function (res) {
            Swal.close();
            clearInterval(timerInterval);
            $('.myself h4').text(res.callerName);
            $('.friend h4').text(res.listenerName);

            // Caller show its screen and start calling to listener
            navigator.mediaDevices
              .getUserMedia({
                video: true,
                audio: true,
              })
              .then((stream) => {
                // Show stream of caller
                let video = document.getElementById('my-camera');
                addVideoStream(video, stream);

                // Emit event call to listener
                let call = peer.call(res.listenerPeerId, stream);
                // Caller listen listener stream
                call.on('stream', function (remoteStream) {
                  // Show stream of listener
                  let remoteVideo = document.getElementById('peer-camera');
                  addVideoStream(remoteVideo, remoteStream);
                });

                // Caller send call cancelation to listener
                $('.end-call-video').on('click', function () {
                  let data = { listenerId: res.listenerId };
                  socket.emit('caller-send-call-cancelation-to-listener', data);
                });
                // Caller receive call cancelation of listener
                socket.on(
                  'response-listener-send-call-cancelation-to-caller',
                  () => {
                    $('.video-chat-container').hide();
                    let video = document.getElementById('my-camera');
                    let videoPeer = document.getElementById('peer-camera');
                    stopStreamVideo(video);
                    stopStreamVideo(videoPeer);
                  }
                );
              });
          });
        },
        onClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        return false;
      });
      $('.swal2-container').css({ 'z-index': 2000000 });
      $('.swal2-confirm').remove();
    });
  });

  // Step 8: Server send request call to listener
  socket.on('server-send-request-call-to-listener', function (res) {
    let dataForEmit = {
      callerId: res.callerId,
      listenerId: res.listenerId,
      callerName: res.callerName,
      listenerName: res.listenerName,
      listenerPeerId: res.listenerPeerId,
    };

    $.getScript('//cdn.jsdelivr.net/npm/sweetalert2@10', function () {
      let timerInterval;
      Swal.fire({
        title: `${res.callerName} want to start a video call with you &nbsp; <i class="fa fa-volume-control-phone"></i>`,
        html: `Time: <strong style="color: #d43f3a"></strong> s <br/><br/>
                <button id="btn-reject-call" class="btn btn-danger" style="cursor: pointer;">Reject call</button>
                <button id="btn-accept-call" class="btn btn-success" style="cursor: pointer;">Accept call</button>`,
        timer: 30000,
        //timerProgressBar: true,
        allowOutsideClick: false,
        onBeforeOpen: () => {
          $('#btn-reject-call')
            .unbind('click')
            .on('click', function () {
              Swal.close();
              clearInterval(timerInterval);

              // Step 10: Listener send reject request call to server
              socket.emit(
                'listener-reject-request-call-to-server',
                dataForEmit
              );
            });
          $('#btn-accept-call')
            .unbind('click')
            .on('click', function () {
              Swal.close();
              clearInterval(timerInterval);

              // Step 11: Listener send accept request call to server
              socket.emit(
                'listener-accept-request-call-to-server',
                dataForEmit
              );
            });
          Swal.showLoading();
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector('strong').textContent = Math.ceil(
              Swal.getTimerLeft() / 1000
            );
          }, 1000);
        },
        onOpen: () => {
          // Step 9: Server send cancel request call to listener
          socket.on(
            'server-send-cancel-request-call-to-listener',
            function (res) {
              Swal.close();
              clearInterval(timerInterval);
            }
          );

          // Step 14: Server send accept request call to listener
          socket.on('server-send-accept-call-to-listener', function (res) {
            Swal.close();
            clearInterval(timerInterval);
            $('.video-chat-container').show();
            $('.myself h4').text(res.listenerName);
            $('.friend h4').text(res.callerName);

            peer.on('call', function (call) {
              navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                  let video = document.getElementById('my-camera');
                  addVideoStream(video, stream);

                  // Listener answer media stream to caller
                  call.answer(stream);
                  // Listener listen and receive caller stream
                  call.on('stream', function (remoteStream) {
                    // Show caller stream
                    let remoteVideo = document.getElementById('peer-camera');
                    addVideoStream(remoteVideo, remoteStream);
                  });

                  // Listener send call cancelation to caller
                  $('.end-call-video').on('click', function () {
                    let data = { callerId: res.callerId };
                    socket.emit(
                      'listener-send-call-cancelation-to-caller',
                      data
                    );
                  });
                  // Listener receive call cancelation of caller
                  socket.on(
                    'response-caller-send-call-cancelation-to-listener',
                    () => {
                      $('.video-chat-container').hide();
                      let video = document.getElementById('my-camera');
                      let videoPeer = document.getElementById('peer-camera');
                      stopStreamVideo(video);
                      stopStreamVideo(videoPeer);
                    }
                  );
                });
            });
          });
        },
        onClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        return false;
      });
      $('.swal2-container').css({ 'z-index': 2000000 });
      $('.swal2-confirm').remove();
    });
  });
});
