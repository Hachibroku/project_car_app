import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './VehicleList.css';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/projects/api/vehicles/')
      .then((response) => {
        if (!response.ok) {
          throw Error('Could not fetch the data for that resource');
        }
        return response.json();
      })
      .then((data) => {
        setVehicles(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h2>Vehicle List</h2>
      {error && <div>{error}</div>}
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="vehicle-item">
          <Link to={`/vehicles/${vehicle.id}`}>{vehicle.name}</Link>
          {/* Other vehicle attributes here */}
        </div>
      ))}
    </div>
  );
}

export default VehicleList;
