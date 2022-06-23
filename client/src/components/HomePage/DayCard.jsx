import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function DayCard(props) {
  return (
    <Box sx={{ maxWidth: 275 }} className='DayCard'>
      <Card variant="outlined" >
        <CardContent>
          <header>
            <div className="date">{props.data.date}</div>
            <h4 className="day">{props.data.dayName}</h4>
          </header>
          <div className="details">
            <div className="temperature">
              <div className="max">{props.data.max}˚</div>
              <div className="min">{props.data.min}˚</div>
            </div>
            <div className="weather-logo">
              <img src={`https://www.accuweather.com/images/weathericons/${props.data.iconNum}.svg`} alt="" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
