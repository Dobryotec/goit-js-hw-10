import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.getElementById('search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');
input.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));

function onInputClick(e) {
  e.preventDefault();
  let query = e.target.value.trim();
  if (query === '') {
    clear();
  } else {
    fetchCountries(query)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length >= 2 && countries.length <= 10) {
          return createMarkupList(countries);
        } else if (countries.length === 1) {
          return createMarkup(countries);
        }
      })
      .catch(onFetchError);
  }
}

function createMarkup(countries) {
  clear();
  div.innerHTML = countries.map(
    ({ name, flags, capital, population, languages }) => {
      const allLanguages = Object.values(languages);
      const lang = allLanguages.map(lang => lang).join(', ');
      return `
      <div class="wrapper"> 
    <img src="${flags.svg}" alt="flag" width="50" height="50">
    <h1>${name.common}</h1>
    </div>
    <p><span class ="text">Capital:</span> ${capital}</p>
    <p><span class ="text">Population:</span> ${population}</p>
    <p><span class ="text">Languages: </span> ${lang}</p>`;
    }
  );
}

function createMarkupList(countries) {
  clear();
  return (ul.innerHTML = countries
    .map(
      ({ name, flags }) =>
        `<li class="list">
    <img src="${flags.svg}" alt="flag" width="50" height="50">
    <h1>${name.common}</h1>
    </li>`
    )
    .join(''));
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clear() {
  div.innerHTML = '';
  ul.innerHTML = '';
}
