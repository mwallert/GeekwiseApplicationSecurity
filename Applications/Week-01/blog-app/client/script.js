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

    createBlogPost(blog);
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
    .then(res => res.json())
    .then(newBlog => {
      buildBlogPosts([newBlog.data]);
      newPost.value = "";
      newPost.sig = "";
    })
    .catch(error => console.log("Error: ", error));
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
      const postEl = document.createElement('div');
      const actionContainer = document.createElement('div');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      const postContent = document.createElement('p');
      const postSig = document.createElement('p');
      const timeStamp = document.createElement('p');
      const editField = document.createElement('input');

      postContent.innerText = post.post;
      postSig.innerText = post.sig;
      editField.value = post.post;
      editButton.innerText = 'Edit';
      deleteButton.innerText = 'Delete';

      let time = new Date(post.created_at);
      timeStamp.innerText = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;

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

          editBlogPost(post)
            .then(updatedPost => {
              postContent.innerText = updatedPost.data.post;
              let updatedTime = new Date(updatedPost.data.updated_at);
              timeStamp.innerText = `${updatedTime.getMonth() + 1}/${updatedTime.getDate()}/${updatedTime.getFullYear()}`;
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
      postEl.appendChild(timeStamp);
      postEl.appendChild(actionContainer);

      postsContainer.appendChild(postEl);
    });
  }
}());