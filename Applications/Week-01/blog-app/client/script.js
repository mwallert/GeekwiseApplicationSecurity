(function(){
  const api = "http://localhost:3000/api"
  const form = selectEl('#blogForm');
  const post = selectEl('#post');
  const sig = selectEl('#sig');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const blog = {
      post: post.value,
      sig: sig.value
    };

    createBlogPost(blog);
  });

  function selectEl(el) {
    return document.querySelector(el);
  }

  function getAllBlogs() {
    fetch(`${api}/blogs`, {
      method: "GET",
    })
    .then(blogs => console.log(blogs))
    .catch(error => console.log(error));
  }

  function createBlogPost(blog) {
    return fetch(`${api}/blogs`, {
      method: "POST",
      body: JSON.stringify(blog),
      headers: new Headers({"Content-Type": "application/json"})
    })
    .then(res => res.json())
    .then(newBlog => console.log("Created: ", newBlog.data))
    .catch(error => console.log("Error: ", error));
  }

  function editBlogPost(blog) {
    fetch(`${api}/blogs/${blog.id}`, {
      method: "PUT",
      body: blog,
      headers: {"Content-Type": "Application/Json"}
    })
    .then(updatedBlog => console.log(updatedBlog))
    .catch(error => console.log(error));
  }

  function deleteBlogPost(id) {
    fetch(`${api}/blogs/${blog.id}`, {
      method: "DELETE",
    })
    .then(res => console.log(res))
    .catch(error => console.log(error));
  }
}());