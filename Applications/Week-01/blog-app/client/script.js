(function(){
  const title = document.querySelector('#title');

  title.addEventListener('click', (e) => {
    alert(`You clicked the title, it says: ${e.target.textContent}`);
  });
}());