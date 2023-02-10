export default function fetchCountries(query) {
  return fetch(
    `https://restcountries.com/v3.1/name/${query}?fields=name,capital,population,flags,languages`
  ).then(res => {
    if (res.status === 404) {
      throw new Error(res.status);
    }
    return res.json();
  });
}
