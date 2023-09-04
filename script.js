'use strict';

const inputEl = document.getElementById('input-link');
const btnShorten = document.getElementById('btn-shorten');
const shortLinkContainer = document.querySelector('.shortened-link__container');

const clearInput = function (input) {
  input.value = '';
};

const enableCopyBtn = function (btn, shortUrl) {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    navigator.clipboard.writeText(shortUrl);
  });
};

const shortenLink = async function () {
  try {
    const longUrl = inputEl.value;
    const apiUrl = `https://api.shrtco.de/v2/shorten?url=${longUrl}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    const shortUrl = await data.result.short_link;

    if (!data.ok) throw new Error('Could not shorten link!');

    renderLink(shortUrl, longUrl);
    clearInput(inputEl);
  } catch (err) {
    console.log(err);
  }
};

const renderLink = function (shortUrl, longUrl) {
  const html = `  <div class="shortened-link__box">
            <a href="${longUrl}" class="long-link">${longUrl}</a>
            <div class="short-link__box">
              <a href="https://${shortUrl}" class="short-link">${shortUrl}</a>
              <a href="#" class="btn copy-link__btn font-bold" >Copy</a>
            </div>
          </div>`;

  shortLinkContainer.insertAdjacentHTML('afterbegin', html);

  const btnCopy = document.querySelector('.copy-link__btn');
  enableCopyBtn(btnCopy, shortUrl);
};

//

//Event Listeners

btnShorten.addEventListener('click', (e) => {
  e.preventDefault();
  shortenLink();
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  shortenLink();
});
