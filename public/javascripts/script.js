const btnRun = document.querySelector('button');
const gifImg = document.getElementById('loading-gif');
const h1 = document.querySelector('h1');

btnRun.addEventListener('click', () => {
  h1.innerText = "Running script..."
  gifImg.style.display = "unset";
  btnRun.innerText = 'Please wait';
  btnRun.classList.add('disabled')
})

