import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

let searchCountryName = '';

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  searchCountryName = input.value.trim();
  if (searchCountryName === '') {
    clearAll();
    return;
  } else
    fetchCountries(searchCountryName)
      .then(countryNames => {
        if (countryNames.length < 2) {
          createCountrieCard(countryNames);
          Notiflix.Notify.success('Here your result');
        } else if (countryNames.length < 10 && countryNames.length > 1) {
          createCountrieList(countryNames);
          Notiflix.Notify.success('Here your results');
        } else {
          clearAll();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
}

function createCountrieCard(country) {
  clearAll();
  const infoCountries = country[0];
  const readyCard = `<div class="country-card">
        <div class="country-card--header">
            <img src="${
              infoCountries.flags.svg
            }" alt="Country flag" width="55", height="35">
            <h2 class="country-card--name"> ${infoCountries.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${
              infoCountries.capital
            }</span></p>
            <p class="country-card--field">Population: <span class="country-value">${
              infoCountries.population
            }</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(
              infoCountries.languages
            ).join(',')}</span></p>
    </div>`;
  div.innerHTML = readyCard;
}

function createCountrieList(country) {
  clearAll();
  const readyList = country
    .map(
      infoCountries =>
        `<li class="country-list--item">
            <img src="${infoCountries.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${infoCountries.name.official}</span>
        </li>`
    )
    .join('');
  list.insertAdjacentHTML('beforeend', readyList);
}

function clearAll() {
  list.innerHTML = '';
  div.innerHTML = '';
}
