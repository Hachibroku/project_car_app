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
      setEditedJobData(job); // Load current job data into the edit form
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
        // Refresh your vehicle data or remove the job from the list
        setVehicle(prevState => ({ ...prevState, jobs: prevState.jobs.filter(job => job.id !== jobId) }));
    });
  };



  return (
    <div className="vehicle-detail-container">
        <h2>Vehicle Detail</h2>
        {error && <div>{error}</div>}
        {vehicle ? (
          <div className="vehicle-item">
              <h3>{vehicle.name}</h3>
              {/* ...existing code... */}

              {showAddJobForm ? (
                <div className="add-job-form">
                  <input  placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} />
                  <textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} />
                  <input placeholder="Estimated Time (eg. 6:00:00 for 6 hours)" value={newJob.estimated_time} onChange={(e) => setNewJob({...newJob, estimated_time: e.target.value})} />
                  <button onClick={handleJobSubmit}>Add Job</button>
                  <button onClick={toggleAddJobForm}>Cancel</button>
                </div>
              ) : (
                <button onClick={toggleAddJobForm}>+ Add Job</button>
              )}

              {vehicle.jobs && vehicle.jobs.length > 0 ? (
                <div className="vehicle-jobs">
                    <h4>Jobs:</h4>
                    {vehicle.jobs.map(job => (
                      <div key={job.id} className="job-item">
                          {jobBeingEdited === job.id ? (
                              // Show edit form
                              <>
                                  <label>Title: </label>
                                  <input
                                      value={editedJobData.title}
                                      onChange={(e) => setEditedJobData({...editedJobData, title: e.target.value})}
                                  />

                                  <label>Description: </label>
                                  <textarea
                                      value={editedJobData.description}
                                      onChange={(e) => setEditedJobData({...editedJobData, description: e.target.value})}
                                  />

                                  <label>Estimated Time: </label>
                                  <input
                                      value={editedJobData.estimated_time}
                                      onChange={(e) => setEditedJobData({...editedJobData, estimated_time: e.target.value})}
                                  />

                                  <button onClick={() => handleEditSave(job.id)}>Save</button>
                                  <button onClick={() => setJobBeingEdited(null)}>Cancel</button>
                              </>
                          ) : (
                              // Show job details
                              <>
                                  <h5>{job.title}</h5>
                                  <p>{job.description}</p>
                                  <p>Estimated Time: {job.estimated_time}</p>
                                  <button onClick={() => startEditingJob(job)}>Edit</button>
                                  <button onClick={() => handleJobDelete(job.id)}>Delete</button>
                              </>
                          )}
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
