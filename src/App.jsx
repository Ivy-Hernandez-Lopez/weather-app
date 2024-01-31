import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
const APIkey = '653b2b45956cc39a057fc63c82c9281f';

function App() {

  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [finder, setFinder] = useState();

  const success = position => {
    console.log(position);
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    }
    setCoords(obj);
    console.log(obj)
  }

  //console.log(weather)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}`;
      axios.get(url)
        .then(res=> {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9/5) + 32).toFixed(2),
          }
          setTemp(obj)
          setWeather(res.data);
        })
        .catch(err=> console.log(err))
        .finally(()=>{
          setIsLoading(false);
        })
    }    
  }, [coords]);

  useEffect(() => {
    if (textInput) {
      const url =`https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}`
      axios.get(url)
        .then(res => {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9/5) + 32).toFixed(2),
          }
          setTemp(obj);
          setFinder(res.data
          )})
        .catch(err=> console.log(err));
    }    
  }, [textInput]);

  console.log(finder);
  
  return (
    <>
      <div className='app'>
        {
          isLoading ?
            <img src="https://static.wixstatic.com/media/5b599f_70c51b8be6ec4bbf978979aaa5c26ee6~mv2.gif" alt="Loading..." />
          :
          textInput ?
          <WeatherCard
            weather={finder}
            temp={temp}
            setTextInput={setTextInput}
            />
          :
            <WeatherCard
            weather={weather}
            temp={temp}
            setTextInput={setTextInput}
            />
        }
      </div>
    </>
  )
}

export default App

