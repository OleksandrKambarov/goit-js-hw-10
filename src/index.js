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
