(function(){
  // Setup variables that should never change
  const api = "http://localhost:3000/api",
   postsContainer = selectEl('#posts'),
   form = selectEl('#blogForm'),
   newPost = selectEl('#post'),
   sig = selectEl('#sig');

  // Liquid variables
  let allBlogs = [];

  document.addEventListener('DOMContentLoaded', e => {
    getAllBlogs()
      .then(blogs => {
        allBlogs = blogs.data;
        buildBlogPosts(allBlogs);
      })
      .catch(error => {
        throw error;
      });
  });
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    const blog = {
      post: newPost.value,
      sig: sig.value
    };

    createBlogPost(blog)
      .then(newBlog => {
        buildBlogPosts([newBlog.data]);
        newPost.value = "";
        sig.value = "";
      })
      .catch(error => {
        throw error;
      });
  });

  function selectEl(el) {
    return document.querySelector(el);
  }

  function getAllBlogs() {
    return fetch(`${api}/blogs`, {
      method: "GET",
    })
    .then(res => res.json());
  }

  function createBlogPost(blog) {
    return fetch(`${api}/blogs`, {
      method: "POST",
      body: JSON.stringify(blog),
      headers: new Headers({"Content-Type": "application/json"})
    })
    .then(res => res.json());
  }

  function editBlogPost(blog) {
    return fetch(`${api}/blogs/${blog.id}`, {
      method: "PUT",
      body: JSON.stringify(blog),
      headers: {"Content-Type": "Application/Json"}
    })
    .then(res => res.json());
  }

  function deleteBlogPost(id) {
    return fetch(`${api}/blogs/${id}`, {
      method: "DELETE",
    })
    .then(res => res.json());
  }

  function buildBlogPosts(posts) {
    posts.forEach(post => {
      const postEl = document.createElement('div'),
        actionContainer = document.createElement('div'),
        editButton = document.createElement('button'),
        deleteButton = document.createElement('button'),
        postContent = document.createElement('p'),
        postSig = document.createElement('p'),
        editField = document.createElement('input');

      const time = new Date(post.updated_at);
      let timeStamp = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;

      postContent.innerText = post.post;
      postSig.innerText = `${post.sig} - ${timeStamp}`;
      editField.value = post.post;
      editButton.innerText = 'Edit';
      deleteButton.innerText = 'Delete';

      postContent.classList = 'post-content';
      postEl.classList = 'col-12 post';
      actionContainer.classList = 'action-buttons';
      editButton.classList = 'btn btn-primary';
      deleteButton.classList = 'btn btn-danger';
      editField.classList = 'form-control hide';

      editButton.addEventListener('click', e => {
        const button = e.target;
        if(button.classList.contains('btn-primary')) {
          button.classList = 'btn btn-success';
          button.innerText = 'Save';

          postContent.classList.add('hide');
          editField.classList.remove('hide');
        } else {
          button.classList = 'btn btn-primary';
          button.innerText = 'Edit';

          postContent.classList.remove('hide');
          editField.classList.add('hide');

          post.post = editField.value;
          post.updated_at = new Date();

          editBlogPost(post)
            .then(updatedPost => {
              const updatedTime = new Date(updatedPost.data.updated_at);
              timeStamp = `${updatedTime.getMonth() + 1}/${updatedTime.getDate()}/${updatedTime.getFullYear()}`;

              postContent.innerText = updatedPost.data.post;
              postSig.innerText = `${post.sig} - ${timeStamp}`;
            })
            .catch(error => {
              throw error;
            });
        }
      });

      deleteButton.addEventListener('click', e => {
        deleteBlogPost(post.id)
          .then(result => {
            if(result.data === 1) {
              postsContainer.removeChild(postEl);
            }
          })
          .catch(error => {
            throw error;
          });
      });

      actionContainer.appendChild(editButton);
      actionContainer.appendChild(deleteButton);

      postEl.appendChild(editField);
      postEl.appendChild(postContent);
      postEl.appendChild(postSig);
      postEl.appendChild(actionContainer);

      postsContainer.appendChild(postEl);
    });
  }
}());