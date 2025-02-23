import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Download, X } from 'lucide-react';
import api from '../services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    const statusColors = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBooking) {
      console.error('No booking selected for cancellation');
      return;
    }
    try {
      await api.put(`/bookings/${selectedBooking.id}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const downloadTicket = (booking) => {
    console.log('Downloading ticket for booking:', booking.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">No bookings found</h3>
            <p className="mt-1 text-gray-500">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-gray-50 rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">PNR Number</p>
                    <p className="text-xl font-semibold text-gray-800">{booking.id}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="col-span-1">
                    <h3 className="text-xl font-semibold text-gray-800">{booking.trainName}</h3>
                    <p className="text-sm text-gray-500">Train #{booking.trainNumber}</p>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-800">{booking.source} - {booking.destination}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-800">{booking.departureTime}, {booking.departureDate}</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-end">
                    <p className="text-2xl font-bold text-gray-800">₹{booking.totalFare}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Passengers</h4>
                  <div className="space-y-1 text-gray-700">
                    {booking.passengers.map((passenger, index) => (
                      <div key={index}>
                        {passenger.name} - Seat {passenger.seatNumber}
                      </div>
                    ))}
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="flex space-x-4 justify-end">
                    <button
                      onClick={() => downloadTicket(booking)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <Download className="h-5 w-5" />
                      <span className="text-lg">E-Ticket</span>
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition"
                    >
                      <X className="h-5 w-5" />
                      <span className="text-lg">Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
