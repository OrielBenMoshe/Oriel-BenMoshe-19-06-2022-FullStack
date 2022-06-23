import React, { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import { useSearchParams } from 'react-router-dom';

import DayCard from '../HomePage/DayCard';
import FavToggleBtn from './FavToggleBtn';
import ErrModal from '../ErrModal';

import useLocationWeather from '../../hooks/useLocationWeather';

export default function HomePage() {
    const [searchParams] = useSearchParams();
    const queries = Object.fromEntries([...searchParams]);
    const [currentWeather, setCurrentWeather] = useState();
    const [forecastData, setForecastData] = useState();
    const [location, setLocation] = useState(queries.locKey ? queries : { locKey: "215854", locName: "Tel Aviv" });
    const { data, loading, error } = useLocationWeather(location);

    const editForecastData = (forecastArr) => {
        const newArr = forecastArr.map((day) => {
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            let date = new Date(day.Date);
            let dayName = days[date.getDay()];
            date = [date.getDate(), date.getMonth()].join('.');
            let max = day.Temperature.Maximum.Value;
            let min = day.Temperature.Minimum.Value;
            let iconNum = day.Day.Icon;
            return { date, dayName, max, min, iconNum }
        });
        return newArr;
    }

    const getTemperature = () => {
        return currentWeather.Temperature?.Metric
            ? currentWeather.Temperature.Metric.Value
            : currentWeather.Temperature;
    }

    useEffect(() => {
        if (data) {
            setCurrentWeather(data.cityData)
            setForecastData(editForecastData(data.forecastData))
        }
    }, [data])

    if (error) {
        console.log("error:", error);  
        return <ErrModal message={error.message}/>
    };

    return (
        <div className="HomePage">
            <h1>Home</h1>
            {loading ? <h1>Loading...</h1>
                : <Paper className='paper' elevation={10} sx={{ padding: '42px' }} >
                    <header>
                        {location && <h2 className="city-name">{location.locName}</h2>}
                        <FavToggleBtn location={location && location} />
                    </header>
                    <div className="current-weather-container">
                        <div className="details">
                            <h3>{"Now"}</h3>
                            <div className="temperature"> {currentWeather && getTemperature()}˚</div>
                            <h3 className='weather-text'>{currentWeather && currentWeather.WeatherText}</h3>
                        </div>
                        <div className="weather-logo">
                            {currentWeather && <img src={`https://www.accuweather.com/images/weathericons/${currentWeather.WeatherIcon}.svg`} alt="" />}
                        </div>
                    </div>
                    <div className="forecast-container">
                        {forecastData && forecastData.map((data, index) => (
                            <DayCard key={index} data={data} />
                        ))}
                    </div>
                </Paper>}
        </div>
    );
}