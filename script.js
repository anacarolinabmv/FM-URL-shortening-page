'use strict';

const inputEl = document.getElementById('input-link');
const btnShorten = document.getElementById('btn-shorten');

const shortenLink = async function () {
  try {
    const longUrl = inputEl.value;
    const apiUrl = `https://api.shrtco.de/v2/shorten?url=${longUrl}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.ok) throw new Error('Could not shorten link! ');

    console.log(data.result.short_link);
  } catch (err) {
    console.log(err);
  }
};

btnShorten.addEventListener('click', (event) => {
  event.preventDefault();
  shortenLink();
});
