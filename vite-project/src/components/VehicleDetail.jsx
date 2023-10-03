import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './VehicleDetail.css';

function VehicleDetail() {
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);
  const { vehicleId } = useParams(); // Get the vehicleId from the URL

  useEffect(() => {
    fetch(`http://localhost:8000/projects/api/vehicles/${vehicleId}/`)
      .then((response) => {
        if (!response.ok) {
          throw Error('Could not fetch the data for that resource');
        }
        return response.json();
      })
      .then((data) => {
        setVehicle(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [vehicleId]);

  return (
    <div className="vehicle-detail-container">
        <h2>Vehicle Detail</h2>
        {error && <div>{error}</div>}
        {vehicle ? (
            <div className="vehicle-item">
                <h3>{vehicle.name}</h3>
                <p>Make: {vehicle.make}</p>
                <p>Model: {vehicle.model}</p>
                <p>Year: {vehicle.year}</p>

                {vehicle.jobs && vehicle.jobs.length > 0 ? (
                    <div className="vehicle-jobs">
                        <h4>Jobs:</h4>
                        {vehicle.jobs.map(job => (
                            <div key={job.id} className="job-item">
                                <h5>{job.title}</h5>
                                <p>{job.description}</p>
                                <p>Estimated Time: {job.estimated_time}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No Jobs assigned to this vehicle yet.</p>
                )}
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
);
}

export default VehicleDetail;
