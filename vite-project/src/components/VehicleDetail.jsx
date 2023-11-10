import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VehicleDetail() {
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState(null);
  const {vehicleId} = useParams();
  const [newJob, setNewJob] = useState({ title: "", description: "", estimated_time: "" });
  const [showAddJobForm, setShowAddJobForm] = useState(false);
  const [jobBeingEdited, setJobBeingEdited] = useState(null);
  const [editedJobData, setEditedJobData] = useState({ title: "", description: "", estimated_time: "" });



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


  const toggleAddJobForm = () => {
    setShowAddJobForm(!showAddJobForm);
  };


  const handleJobSubmit = () => {
    fetch(`http://localhost:8000/projects/api/jobs/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newJob, vehicle: vehicleId })
    })
    .then(response => response.json())
    .then(data => {
        setVehicle(prevState => ({ ...prevState, jobs: [...prevState.jobs, data] }));
        setNewJob({ title: "", description: "", estimated_time: ""});
        setShowAddJobForm(false);
    });
};


  const handleJobUpdate = (jobId, updatedData) => {
    fetch(`http://localhost:8000/projects/api/jobs/${jobId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        const updatedJobs = vehicle.jobs.map(job => {
            if (job.id === jobId) {
                return data;
            }
            return job;
        });
        setVehicle({...vehicle, jobs: updatedJobs});
        setJobBeingEdited(null);
    });
  };


    const startEditingJob = (job) => {
      setJobBeingEdited(job.id);
      setEditedJobData(job);
    };

    const handleEditSave = (jobId) => {
        handleJobUpdate(jobId, editedJobData);
        setJobBeingEdited(null);
    };


  const handleJobDelete = (jobId) => {
    fetch(`http://localhost:8000/projects/api/jobs/${jobId}/`, {
        method: 'DELETE',
    })
    .then(() => {
        setVehicle(prevState => ({ ...prevState, jobs: prevState.jobs.filter(job => job.id !== jobId) }));
    });
  };



  return (
    <div>
        <nav>
          <ul>
            <li><a href="/vehicles">Home</a></li>
            {/* Other nav links */}
          </ul>
          {showAddJobForm ? (
                <div className="popup-form">
                  <input  placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} />
                  <textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} />
                  <input placeholder="Estimated Time (eg. 6:00:00 for 6 hours)" value={newJob.estimated_time} onChange={(e) => setNewJob({...newJob, estimated_time: e.target.value})} />
                  <button onClick={handleJobSubmit}>Add Job</button>
                  <button onClick={toggleAddJobForm}>Cancel</button>
                </div>
              ) : (
                <button onClick={toggleAddJobForm}>+ Add Job</button>
            )}
        </nav>
        {error && <div>{error}</div>}
        {vehicle ? (
          <div>
              <h3>{vehicle.name} Project Details</h3>
              <h4>Current Jobs:</h4>


                    {vehicle.jobs && vehicle.jobs.length > 0 ? (
                        <div className="vehicle-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Estimated Time</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicle.jobs.map(job => (
                                        <tr key={job.id}>
                                            {jobBeingEdited === job.id ? (
                                                <>
                                                    <td>
                                                        <input
                                                            value={editedJobData.title}
                                                            onChange={(e) => setEditedJobData({...editedJobData, title: e.target.value})}
                                                        />
                                                    </td>
                                                    <td>
                                                        <textarea
                                                            value={editedJobData.description}
                                                            onChange={(e) => setEditedJobData({...editedJobData, description: e.target.value})}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            value={editedJobData.estimated_time}
                                                            onChange={(e) => setEditedJobData({...editedJobData, estimated_time: e.target.value})}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button onClick={() => handleEditSave(job.id)}>Save</button>
                                                        <button onClick={() => setJobBeingEdited(null)}>Cancel</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{job.title}</td>
                                                    <td>{job.description}</td>
                                                    <td>{job.estimated_time}</td>
                                                    <td>
                                                        <button onClick={() => startEditingJob(job)}>Edit</button>
                                                        <button onClick={() => handleJobDelete(job.id)}>Delete</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
