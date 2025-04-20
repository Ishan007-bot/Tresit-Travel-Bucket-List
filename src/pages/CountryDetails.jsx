import React from 'react';
import { useParams } from 'react-router-dom';

const CountryDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="container">
      <h1>Country Details</h1>
      <p>This page will display detailed information about a country with ID: {id}</p>
    </div>
  );
};

export default CountryDetails; 