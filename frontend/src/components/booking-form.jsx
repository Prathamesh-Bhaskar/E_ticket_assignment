import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import api from '../services/api';

const BookingForm = ({ trainDetails, onBookingSuccess }) => {
  const [passengers, setPassengers] = useState([
    {
      name: '',
      age: '',
      gender: 'male',
      isDiscountEligible: false,
      berthPreference: 'no-preference'
    }
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });

  // Calculate total fare based on passengers and discounts
  const calculateTotalFare = () => {
    return passengers.reduce((total, passenger) => {
      let fare = trainDetails.basePrice;
      if (passenger.isDiscountEligible) {
        fare *= 0.8; // 20% discount
      }
      if (parseInt(passenger.age) < 12) {
        fare *= 0.5; // 50% discount for children
      }
      return total + fare;
    }, 0);
  };

  // Add new passenger form
  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([
        ...passengers,
        {
          name: '',
          age: '',
          gender: 'male',
          isDiscountEligible: false,
          berthPreference: 'no-preference'
        }
      ]);
    }
  };

  // Remove passenger form
  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  // Update passenger details
  const updatePassenger = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  // Handle form submission: POST booking to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalFare = calculateTotalFare();
    const bookingData = {
      trainId: trainDetails._id || trainDetails.id, // ensure backend id is passed
      passengers,
      totalFare,
      contactInfo
    };

    try {
      const res = await api.post('/bookings', bookingData);
      console.log('Booking successful:', res.data);
      if (onBookingSuccess) {
        onBookingSuccess(res.data);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
        {/* Train Summary */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Train Number</p>
              <p className="font-semibold">{trainDetails.trainNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Train Name</p>
              <p className="font-semibold">{trainDetails.trainName}</p>
            </div>
            <div>
              <p className="text-gray-600">From - To</p>
              <p className="font-semibold">
                {trainDetails.source} - {trainDetails.destination}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Date & Time</p>
              <p className="font-semibold">{trainDetails.departureTime}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Passenger Forms */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Passenger Details</h3>
              <button
                type="button"
                onClick={addPassenger}
                disabled={passengers.length >= 6}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                <Plus className="h-4 w-4" />
                <span>Add Passenger</span>
              </button>
            </div>

            {passengers.map((passenger, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Passenger {index + 1}</h4>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) =>
                        updatePassenger(index, 'name', e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <input
                      type="number"
                      value={passenger.age}
                      onChange={(e) =>
                        updatePassenger(index, 'age', e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                      max="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      value={passenger.gender}
                      onChange={(e) =>
                        updatePassenger(index, 'gender', e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Berth Preference
                    </label>
                    <select
                      value={passenger.berthPreference}
                      onChange={(e) =>
                        updatePassenger(index, 'berthPreference', e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="no-preference">No Preference</option>
                      <option value="lower">Lower Berth</option>
                      <option value="middle">Middle Berth</option>
                      <option value="upper">Upper Berth</option>
                      <option value="side-lower">Side Lower</option>
                      <option value="side-upper">Side Upper</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={passenger.isDiscountEligible}
                        onChange={(e) =>
                          updatePassenger(
                            index,
                            'isDiscountEligible',
                            e.target.checked
                          )
                        }
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Eligible for concession (Senior Citizen/Student/Defense)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  value={contactInfo.address}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, address: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fare Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Fare Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Base Fare ({passengers.length} passengers)
                </span>
                <span>
                  ₹{trainDetails.basePrice * passengers.length}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount Applied</span>
                <span>
                  -₹{(trainDetails.basePrice * passengers.length) -
                    calculateTotalFare()}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Fare</span>
                <span>₹{calculateTotalFare()}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
