function acceptRequest(userId){
    $('.accept-req').bind('click', function(){
        let contactId = $(this).closest('div[class = "request-details"]').data('uid');
        let target = $(this);
        let data = {
            userId: userId,
            contactId: contactId
        }
        $.ajax({
            url: '/accept-friend',
            type: 'PUT',
            data: data,
            success: function(res){
                target.closest('ul').hide();
                alertify.success('Accepted!');

                socket.emit('confirm-accept-request-to-contact', data);
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}

function deleteRequest(userId){
    $('.close-req').bind('click', function(){
        let contactId = $(this).closest('div[class = "request-details"]').data('uid');
        let target = $(this);
        let data = {
            userId: userId,
            contactId: contactId
        }
        $.ajax({
            url: '/delete-friend',
            type: 'DELETE',
            data: data,
            success: function(res){
                target.closest('ul').hide();
                alertify.success('Removed!');

                socket.emit('confirm-reject-request-to-contact', data);
            },
            error: function(error){
                console.log(error);
            }
        })
    })
}