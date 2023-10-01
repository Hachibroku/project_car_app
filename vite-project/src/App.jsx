import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VehicleList from './components/VehicleList';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><a href="/vehicles">Vehicles</a></li>
            {/* Other nav links */}
          </ul>
        </nav>
        <Routes>
          <Route path="/vehicles" element={<VehicleList />} />
          {/* Other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
