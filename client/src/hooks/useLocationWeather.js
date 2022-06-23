import { useEffect, useState } from "react";
import Axios from "axios";

export default function useLocationWeather(location) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = (location) => {
       Axios.post(`http://localhost:3001/api/city`, location)
      .then(({data}) => {
              setData(data)
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getWeather(location)
  }, [])
    
  return { data, loading, error };
  
};
