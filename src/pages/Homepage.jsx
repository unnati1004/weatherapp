import React, { useEffect, useState } from "react";
import axios from "axios";
import Switch from "react-switch";
import { FaWind, FaSun, FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import ForecastCard from "../components/ForecastCard";

import styles from "../styles/homepage.module.css";

const Homepage = () => {
  const [darkmode, setMode] = useState(false);
  // const apiKey = process.env.API_KEY;
  const apiKey = "aa38e5c306864cccaef154404251104";
  const [wetherData, setData] = useState("");
  const [forecast, setForecast] = useState("");
  const [tempToggle, setTempToggle] = useState(false);
  const [searchTerm, setSearch] = useState("");
  const [isErr, setErr] = useState('');
  const [loader, setLoader] = useState(false)

  const fetchWeather = (query) => {
    setLoader(true)
    setData('')
    axios
      .get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=7`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      .then((res) => {
        setData(res.data);
        setErr(false);
        setLoader(false)
        setForecast(res.data.forecast.forecastday);
      })
      .catch((err) => {
        console.log(err);
        setErr(err.response.data.error.message);
        setLoader(false)
      });
  };

  const handleMode = () => {
    if (darkmode) {
      setMode(false);
    } else {
      setMode(true);
    }
  };
  const handleTemp = () => {
    if (tempToggle) {
      setTempToggle(false);
    } else {
      setTempToggle(true);
    }
  };

  const callSearch = () => {
    fetchWeather(searchTerm);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        fetchWeather(`${latitude},${longitude}`);
      },
      function (error) {
        console.log(error);
      }
    );
  }, []);

  return (
    <div className={darkmode ? styles.dark : styles.container}>
      <div className={styles.navbar}>
        <div className={styles.heading}>WETHER APP</div>
        <div className={styles.searchbar}>
          <input
            type="search"
            placeholder="Search for cities or pincode..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={callSearch}>Go</button>
        </div>
        <div>
          <div className={styles.switches}>
            <label>Dark</label>
            <Switch
              onChange={handleMode}
              onColor="#145DA0"
              checked={darkmode}
            />
          </div>
          <div className={styles.switches}>
            <label>{tempToggle ? "°F" : "°C"}</label>
            <Switch
              onChange={handleTemp}
              onColor="#145DA0"
              checked={tempToggle}
            />
          </div>
        </div>
      </div>

      {wetherData && !loader && !isErr ? (
        <div className={styles.main}>
          <div className={styles.leftCont}>
            <div className={styles.info}>
              <div>
                <div>
                  <h1>{`${wetherData.location.name}, ${wetherData.location.region}`}</h1>
                  <p>{wetherData.current.condition.text}</p>
                </div>
                <div className={styles.tempTxt}>
                  {tempToggle
                    ? `${wetherData.current.temp_f}°F`
                    : `${wetherData.current.temp_c}°C`}
                </div>
              </div>
              <div className={styles.icon}>
                <img
                  src={wetherData.current.condition.icon}
                  alt="wether_logo"
                />
              </div>
            </div>
            <div className={styles.details}>
              <div>
                <div>
                  <FaTemperatureHigh size={"30px"} />
                </div>
                <div>
                  <p>Real Feel</p>
                  <h1>30°C</h1>
                </div>
              </div>
              <div>
                <div>
                  <FaSun size={"30px"} />
                </div>
                <div>
                  <p>UV Index</p>
                  <h1>{wetherData.current.uv}</h1>
                </div>
              </div>
              <div>
                <div>
                  <FaWind size={"30px"} />
                </div>
                <div>
                  <p>Wind Speed</p>
                  <h1>{`${wetherData.current.wind_kph}/kph`}</h1>
                </div>
              </div>
              <div>
                <div>
                  <WiHumidity size={"30px"} />
                </div>
                <div>
                  <p>Humidity</p>
                  <h1>{wetherData.current.humidity}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightCont}>
            <p>7-DAY FORECAST</p>
            {forecast.length &&
              forecast.map((e, index) => {
                return (
                  <div className={styles.forecastDiv} key={index}>
                    <ForecastCard {...e} />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className={styles.loadingDiv}>
          {loader && !isErr ? <h3>{"Loading..."}</h3> : <h3>{isErr}</h3>}
        </div>
      )}
    </div>
  );
};

export default Homepage;
