import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [country, setCountries] = useState("");
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

  const handleSearch = (e) => {
    setCountries(e.target.value);
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
          <p key={country.name.common}>{country.name.common}</p>
        ))
      );
    } else if (searchCount === 1) {
      const name = searchCountries[0].name.common;
      const capital = searchCountries[0].capital[0];
      const area = searchCountries[0].area;
      const languages = searchCountries[0].languages;
      const flag = searchCountries[0].flags.svg;
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
    }
  };

  return (
    <>
      <label>find countries</label>
      <input type="text" value={country} onChange={handleSearch} />
      <div>{!message ? null : message}</div>
    </>
  );
}

export default App;
