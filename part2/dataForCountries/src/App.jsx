import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [country, setCountry] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAllCountries();
  }, []);

  const getAllCountries = () => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response.data);
        setAllCountries(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const countryView = (country) => {
    const name = country.name.common;
    const capital = country.capital[0];
    const area = country.area;
    const languages = country.languages;
    const flag = country.flags.svg;
    console.log(name, capital, area, languages, flag);
    setMessage(
      <>
        <h1>{name}</h1>
        <p>capital {capital}</p>
        <p>area {area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(languages).map((language) => (
            <li key={language}>{language} </li>
          ))}
        </ul>
        <img src={flag} alt="flag" width="200px" />
      </>
    );
  };

  const handleSearch = (e) => {
    setCountry(e.target.value);
    const searchCountries = allCountries.filter((country) => {
      return country.name.common
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });

    const searchCount = searchCountries.length;
    console.log(searchCount);
    if (searchCount > 10) {
      setMessage("Too many matches, specify another filter");
    } else if (searchCount <= 10 && searchCount > 1) {
      setMessage(
        searchCountries.map((country) => (
          <p key={country.name.common}>
            {country.name.common}{" "}
            <button
              onClick={() => {
                countryView(country);
                setCountry(country.name.common);
              }}
            >
              show
            </button>
          </p>
        ))
      );
    } else if (searchCount === 1) {
      countryView(searchCountries[0]);
    }
  };

  return (
    <>
      <label>find countries</label>
      <input
        name="country"
        type="text"
        value={country}
        onChange={handleSearch}
      />
      <div>{!message ? null : message}</div>
    </>
  );
}

export default App;
