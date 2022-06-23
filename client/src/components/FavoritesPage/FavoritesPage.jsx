import React, { useEffect, useState } from 'react';
import CityCard from './CityCard';
import ErrModal from '../ErrModal';

export default function FavoritesPage() {
  const [favoritesArr, setFavoritesArr] = useState();
  const [isError, setIsError] = useState(false);

  const handleIsError = (response) => {
    setIsError(response);
  }

  const removeCard = (locationKey) => {
    const prevFav = JSON.parse(localStorage.getItem("favoritesLocations"));
    const filteredArr = prevFav.filter((item) => (item.locKey != locationKey));
    localStorage.setItem("favoritesLocations", JSON.stringify(filteredArr));
    setFavoritesArr(filteredArr);
  }

  useEffect(() => {
    setIsError(false);
    if (localStorage.getItem("favoritesLocations")) {
      const arr = JSON.parse(localStorage.getItem("favoritesLocations"));
      setFavoritesArr(arr);
    }
  }, [])

  return (
    <div className="FavoritesPage">
      <h1>Favorites</h1>
      <div className="cities-container">
        {
          favoritesArr && favoritesArr.map((location, key) => (
             <CityCard 
              key={key} 
              id={location && location.locKey} 
              location={location} 
              removeCard={removeCard} 
              isError={handleIsError}/>
          ))
        }
      </div>
      {isError && <ErrModal />}
    </div>
  );
}