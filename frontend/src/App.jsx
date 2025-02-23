import React, { useState } from 'react';
import TrainBookingApp from './components/train-booking-app';
import BookingHistory from './components/booking-history';
import AdminDashboard from './components/admin-dashboard';

const App = () => {
  const [view, setView] = useState('customer');

  return (
    <div>
      {/* Simple toggle between Customer and Admin views */}
      <header className="p-4 bg-blue-700 text-white flex justify-between">
        <h1 className="text-xl font-bold">E-Ticketing System</h1>
        <div>
          <button onClick={() => setView('customer')} className="mr-4">
            Customer
          </button>
          <button onClick={() => setView('admin')}>
            Admin
          </button>
        </div>
      </header>

      <main>
        {view === 'customer' ? (
          <>
            <TrainBookingApp />
            <BookingHistory />
          </>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
};

export default App;
