import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [newVehicle, setNewVehicle] = useState({ name: "", make: "", model: "", year: "" });
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [vehicleBeingEdited, setVehicleBeingEdited] = useState(null);
  const [editedVehicleData, setEditedVehicleData] = useState({ name: "", make: "", model: "", year: "" });
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');


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

  const toggleAddVehicleForm = () => {
    setShowAddVehicleForm(!showAddVehicleForm);
  };

  const handleVehicleSubmit = () => {
    fetch('http://localhost:8000/projects/api/vehicles/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle)
    })
    .then(response => response.json())
    .then(data => {
        setVehicles([...vehicles, data]);
        setNewVehicle({ name: '', make: '', model: '', year: '' });
    });
 };

 const handleVehicleUpdate = (vehicleId, updatedData) => {
  fetch(`http://localhost:8000/projects/api/vehicles/${vehicleId}/`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(data => {
      const updatedVehicles = vehicles.map(vehicle => {
          if (vehicle.id === vehicleId) {
              return data;
          }
          return vehicle;
      });
      setVehicles(updatedVehicles);
      setVehicleBeingEdited(null);
  });
 };

  const startEditingVehicle = (vehicle) => {
   setVehicleBeingEdited(vehicle.id);
   setEditedVehicleData(vehicle);
  };

  const handleEditSave = (vehicleId) => {
   handleVehicleUpdate(vehicleId, editedVehicleData);
   setVehicleBeingEdited(null);
  };

 const handleVehicleDelete = (vehicleId) => {
  fetch(`http://localhost:8000/projects/api/vehicles/${vehicleId}/`, {
      method: 'DELETE',
  })
  .then(() => {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  });
 };

 const handleSort = (field) => {
  if (sortField === field) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
};

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });


  return (
    <div>
      <h2>Vehicle List</h2>
      <button onClick={() => setShowAddVehicleForm(true)}>Add New Vehicle</button>
      {showAddVehicleForm && (
      <div className="popup-form">
        <h3>Create a New Vehicle</h3>
        <input placeholder="Vehicle Name" value={newVehicle.name} onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})} />
        <input placeholder="Make" value={newVehicle.make} onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})} />
        <input placeholder="Model" value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} />
        <input placeholder="Year" type="number" value={newVehicle.year} onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})} />
        <button onClick={handleVehicleSubmit}>Submit</button>
        <button onClick={() => toggleAddVehicleForm(false)}>Cancel</button>
     </div>
     )}
            {error && <div className="error">{error}</div>}

    <table className="vehicle-table">
        <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortDirection === 'asc')}</th>
              <th onClick={() => handleSort('year')}>Year {sortField === 'name' && (sortDirection === 'asc')}</th>
              <th onClick={() => handleSort('make')}>Make {sortField === 'name' && (sortDirection === 'asc')}</th>
              <th onClick={() => handleSort('model')}>Model {sortField === 'name' && (sortDirection === 'asc')}</th>
              <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {sortedVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                    {vehicleBeingEdited === vehicle.id ? (
                        <>
                            <td><input placeholder="Name" value={editedVehicleData.name} onChange={(e) => setEditedVehicleData({...editedVehicleData, name: e.target.value})} /></td>
                            <td><input placeholder="Make" value={editedVehicleData.make} onChange={(e) => setEditedVehicleData({...editedVehicleData, make: e.target.value})} /></td>
                            <td><input placeholder="Model" value={editedVehicleData.model} onChange={(e) => setEditedVehicleData({...editedVehicleData, model: e.target.value})} /></td>
                            <td><input placeholder="Year" type="number" value={editedVehicleData.year} onChange={(e) => setEditedVehicleData({...editedVehicleData, year: e.target.value})} /></td>
                            <td>
                                <button onClick={() => handleEditSave(vehicle.id)}>Save</button>
                                <button onClick={() => setVehicleBeingEdited(null)}>Cancel</button>
                            </td>
                        </>
                    ) : (
                        <>
                            <td><Link to={`/vehicles/${vehicle.id}`}>{vehicle.name}</Link></td>
                            <td>{vehicle.year}</td>
                            <td>{vehicle.make}</td>
                            <td>{vehicle.model}</td>
                            <td>
                                <button onClick={() => startEditingVehicle(vehicle)}>Edit</button>
                                <button onClick={() => handleVehicleDelete(vehicle.id)}>Delete</button>
                            </td>
                        </>
                    )}
                </tr>
            ))}
        </tbody>
    </table>
</div>
);
}

export default VehicleList;
