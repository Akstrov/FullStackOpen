//load env

import { useState, useEffect } from "react";
import axios from "axios";

//component for weather
function Weather({ capital }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${
          import.meta.env.VITE_REACT_APP_API_KEY
        }`
      )
      .then((response) => {
        console.log(response.data);
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [capital]);
  if (weather) {
    return (
      <>
        <h1>Weather in {capital}</h1>
        <p>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="weather"
        />
        <p>wind {weather.wind.speed} m/s</p>
      </>
    );
  }
  return null;
}

function App() {
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [message, setMessage] = useState("");
  const [capital, setCapital] = useState("");

  useEffect(() => {
    getAllCountries();
  }, []);

  // const getWeather = () => {
  //   console.log("capital in getweather", capital);
  //   axios
  //     .get(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${
  //         import.meta.env.VITE_REACT_APP_API_KEY
  //       }`
  //     )
  //     .then((response) => {
  //       console.log(response.data);
  //       setWeather(response.data);
  //     })
  //     .catch((error) => {
  //       setMessage("Error", error);
  //     });
  // };

  const getAllCountries = () => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
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

    setMessage(
      <>
        <h1>{name}</h1>
        <p>capital {capital}</p>
        <p>area {area.toLocaleString("en-US")}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(languages).map((language) => (
            <li key={language}>{language} </li>
          ))}
        </ul>
        <img src={flag} alt="flag" width="200px" />
        <h2>Weather in {capital}</h2>
        <p>temperature Celcius</p>
      </>
    );
  };

  const handleSearch = (e) => {
    setCapital("");
    setCountrySearch(e.target.value);
    const searchCountries = allCountries.filter((country) => {
      return country.name.common
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    const searchCount = searchCountries.length;
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
      setCountry(searchCountries[0].name.common);
      setCapital(searchCountries[0].capital[0]);
    }
  };
  return (
    <>
      <label>find countries</label>
      <input
        name="country"
        type="text"
        value={countrySearch}
        onChange={handleSearch}
      />
      <div>{!message ? null : message}</div>
      {capital ? <Weather capital={capital} /> : null}
    </>
  );
}

export default App;
