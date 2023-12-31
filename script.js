'use strict';

//Selecting Elements

const inputEl = document.getElementById('input-link');
const btnShorten = document.getElementById('btn-shorten');
const shortLinkContainer = document.querySelector('.shortened-link__container');
const errorMsgEl = document.querySelector('.error-msg');
const btnClearAll = document.getElementById('clear-all');
const btnNav = document.getElementById('mobile-nav');

let linksArr = [];

//

//Functionality

const clearInput = function (input) {
  input.value = '';
};

const displayError = function (msg) {
  if (msg) errorMsgEl.textContent = msg;

  errorMsgEl.classList.add('error');
  inputEl.classList.add('error');
};
const hideError = function () {
  errorMsgEl.classList.remove('error');
  inputEl.classList.remove('error');
};

const enableCopyBtn = function (btn, shortUrl) {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.classList.add('copied-link');
    btn.innerHTML = 'Copied';
    navigator.clipboard.writeText(shortUrl);
  });
};

const shortenLink = async function () {
  let data;
  try {
    const longUrl = inputEl.value;
    const apiUrl = `https://api.shrtco.de/v2/shorten?url=${longUrl}`;

    if (!longUrl) {
      displayError();
      return;
    }

    const response = await fetch(apiUrl);
    data = await response.json();

    if (!data.ok) throw new Error(`${data.error}`);

    const shortUrl = await data.result.short_link;

    renderLink(shortUrl, longUrl);
    btnClearAll.style.visibility = 'visible';
    setLocalStorage(shortUrl, longUrl);

    clearInput(inputEl);
  } catch (err) {
    displayError(data.error);
  }
};

const renderLink = function (shortUrl, longUrl) {
  let html = `  <div class="shortened-link__box">
            <a href="${longUrl}" class="long-link">${longUrl}</a>
            <div class="short-link__box">
              <a href="https://${shortUrl}" class="short-link">${shortUrl}</a>
              <a href="#" class="btn copy-link__btn font-bold" >Copy</a>
            </div>
          </div>
        `;

  shortLinkContainer.insertAdjacentHTML('afterbegin', html);

  const btnCopy = document.querySelector('.copy-link__btn');
  enableCopyBtn(btnCopy, shortUrl);
};

const setLocalStorage = function (shortUrl, longUrl) {
  linksArr.push([shortUrl, longUrl]);

  localStorage.setItem('links', JSON.stringify(linksArr));
};

const getLocalStorage = function () {
  const links = JSON.parse(localStorage.getItem('links'));
  if (!links) return;

  links.forEach((link) => renderLink(...link));
};
getLocalStorage();

const clearLocalStorage = function () {
  localStorage.clear();

  shortLinkContainer.innerHTML = '';
  shortLinkContainer.appendChild(btnClearAll);
  btnClearAll.style.visibility = 'hidden';
};

const mobileNav = function () {
  const navbar = document.querySelector('.navbar__links');
  const headerIlustration = document.querySelector('.header__ilustration-box');
  navbar.classList.toggle('show__nav');
  headerIlustration.classList.toggle('overlay');
};
///* z-index: 999; */

//Event Listeners

btnShorten.addEventListener('click', (e) => {
  e.preventDefault();
  shortenLink();
});
btnNav.addEventListener('click', (e) => {
  e.preventDefault();
  mobileNav();
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  shortenLink();
});

inputEl.addEventListener('focus', (e) => {
  if (errorMsgEl.classList.contains('error') || inputEl.classList.contains('error')) {
    hideError();
  }
});
btnClearAll.addEventListener('click', (e) => {
  e.preventDefault();
  clearLocalStorage();
});
