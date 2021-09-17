function addNewPost() {
  let idForm = '#form-submit-new-post';
  let title = $(idForm + ' input[name = "title"]').val();
  let image = $(idForm + ' input[name = "image"]').val();
  image = image.substring(image.lastIndexOf('\\') + 1);

  let content = $(idForm + ' textarea[name = "status"]').val();
  let data = {
    title: title,
    image: image,
    content: content,
  };
  $.ajax({
    url: '/new-post',
    type: 'POST',
    data: data,
    success: function (data) {
      clearForm();
      console.log(data);
      let time = new Date();
      let convertTime = moment(time).locale('vi').startOf('seconds').fromNow();
      let postItemSection = `<div class="post-bar">
                              <div class="post_topbar">
                                <div class="usy-dt">
                                  <img src="images/User/${
                                    data.user.avatar
                                  }" alt="" style="height: 50px; width: 50px; object-fit: cover;" />
                                  <div class="usy-name">
                                    <h3>${data.user.fullname}</h3>
                                    <span
                                      ><img src="images/clock.png" alt="" />${convertTime}</span
                                    >
                                  </div>
                                </div>
                                <div class="ed-opts">
                                  <a href="#" title="" class="ed-opts-open"
                                    ><i class="la la-ellipsis-v"></i
                                  ></a>
                                  <ul class="ed-options">
                                    <li><a href="#" title="">Edit Post</a></li>
                                    <li><a href="#" title="">Unsaved</a></li>
                                    <li><a href="#" title="">Unbid</a></li>
                                    <li><a href="#" title="">Close</a></li>
                                    <li><a href="#" title="">Hide</a></li>
                                  </ul>
                                </div>
                              </div>
                              <div class="epi-sec">
                                <ul class="descp">
                                  <li>
                                    <img src="images/icon8.png" alt="" /><span
                                      >Superman</span
                                    >
                                  </li>
                                  <li>
                                    <img src="images/icon9.png" alt="" /><span>VietNam</span>
                                  </li>
                                </ul>
                                <ul class="bk-links">
                                  <li>
                                    <a href="#" title=""><i class="la la-bookmark"></i></a>
                                  </li>
                                  <li>
                                    <a href="#" title=""><i class="la la-envelope"></i></a>
                                  </li>
                                </ul>
                              </div>
                              <div class="job_descp">
                                <h3>${data.title}</h3>
                                <p>
                                  ${data.content}
                                </p>
                                <img src="images/User/${
                                  data.image
                                }" alt="" style="width: 100%; height: 300px; object-fit: cover; display: ${
        data.image == null ? 'none' : 'block'
      }" />
                              </div>
                              <div class="job-status-bar">
                                <ul class="like-com">
                                  <li>
                                    <a href="#"><i class="la la-heart"></i> Like</a>
                                    <img src="images/liked-img.png" alt="" />
                                    <span>${data.reaction}</span>
                                  </li>
                                  <li>
                                    <a href="#" title="" class="com"
                                      ><img src="images/com.png" alt="" /> Comment 15</a
                                    >
                                  </li>
                                </ul>
                                <a><i class="la la-eye"></i>Views 50</a>
                              </div>
                            </div>`;
      $('.posts-section').prepend(postItemSection);
    },
    error: function (error) {
      //
    },
  });
}

function clearForm() {
  let idForm = '#form-submit-new-post';
  $(idForm + ' input[name = "title"]').val('');
  $('#new-post-image').attr('src', '');
  $(idForm + ' textarea[name = "status"]').val('');
  $('#cancel-post').click();
}
