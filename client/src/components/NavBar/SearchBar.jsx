import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function SearchBar(props) {
  const [autocompleteList, setAutocompleteList] = useState();
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { 
    if (inputValue.length === 3) {
      console.log("inputValue:",inputValue);
      Axios.post(`http://localhost:3001/api/autocomplete`, inputValue)
        .then((result) => {
          console.log("autocomplete:", result.data);
          setAutocompleteList(result.data);
        })
        .catch((error)=>{
          console.log("error:", error.response.data);
        })
    } 
  }, [inputValue]);
  
  useEffect(() => {
    if (autocompleteList?.length > 0) {
      // Creating clean array of locations with name and key to each one.
      const editedData = autocompleteList.map((item, key) => {
        return {
          label: item.LocalizedName,
          locKey: item.Key
        }
      });
      setList(editedData);
    }
  }, [autocompleteList]);
    
  return (
    <Search className="SearchBar">
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        disablePortal
        autoComplete={true}
        loading={true}
        id="combo-box-demo"
        onChange={(event, newValue) => {
          navigate(`/Home?locKey=${newValue.locKey}&locName=${newValue.label}`, { replace: true })
          window.location.reload();
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={list}
        sx={{ width: 300 }}
        renderInput={
          (params) => <TextField {...params} label="LOCATION" className="search-field" />
        }
      />
    </Search>
  );
}
