require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3001;
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "weather_cities",
});

const weatherUrl = process.env.REACT_APP_WEATHER;
const forecastUrl = process.env.REACT_APP_FORECAST;
const autocomleteUrl = process.env.REACT_APP_AUTOCOMLETE;
const apiKey = process.env.REACT_APP_APIKEY;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**  -- Get Autocomplete List of locations. -- */
app.post("/api/autocomplete", (req, res) => {
    const inputValue = Object.keys(req.body)[0];
    axios.get( `${autocomleteUrl}?apikey=${apiKey}&q=${inputValue}` )
        .then((result) => {
            console.log(result.data);
            res.send(result.data)
        })
        .catch((error) => {
            console.log("error:", error.response.data.Message);
            res.status(503).send({
              message: error.response.data.Message,
            });
        })
});

/** -- Get City Data and insert to DB if noy exist. -- */
app.post("/api/city", (req, res) => {
  const { locKey } = req.body;
  const { locName } = req.body;
  const sqlFindCity = "SELECT * FROM cities WHERE location_key = ?";
  db.query(sqlFindCity, [locKey], async (err, result) => {
    if (result && result.length) {
    //   console.log("result:", result);
      const { forecast, ...cityData } = result[0];
      const forecastData = JSON.parse(forecast);
      res.send({ cityData, forecastData });
    } else {
      axios
        .get(`${weatherUrl}/${locKey}?apikey=${apiKey}&metric=true`)
        .then(async (result) => {
          const cityData = result.data[0];
          const temperature = cityData.Temperature.Metric.Value;
          const weatherText = cityData.WeatherText;
          const weatherIcon = cityData.WeatherIcon;
          let forecastData = [];
          try {
            const { data } = await axios.get(
              `${forecastUrl}/${locKey}?apikey=${apiKey}&metric=true`
            );
            forecastData = [...data.DailyForecasts];
          } catch (error) {
            console.log(error);
          }
          res.send({ cityData, forecastData });

          const sqlInsert =
            "INSERT INTO cities (location_key, location_name, Temperature, WeatherText, WeatherIcon, forecast) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            sqlInsert,
            [
              locKey,
              locName,
              temperature,
              weatherText,
              weatherIcon,
              JSON.stringify(forecastData),
            ],
            (err, result) => {
              result && console.log("result:", result);
              err && console.log("err:", err);
            }
          );
        })
        .catch((error) => {
          console.log("error:", error.response.data);
          res.status(503).send({
            message: error.response.data,
          });
        });
    }
  });
});

app.listen(port, () => {
  console.log("Running on port " + port);
});
