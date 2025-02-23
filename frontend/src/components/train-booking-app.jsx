import React, { useState, useEffect } from "react";
import { Train, Search, Calendar, User, Clock, MapPin } from "lucide-react";
import api from "../services/api";
import BookingForm from "./booking-form";

const TrainBookingApp = () => {
  const [selectedTab, setSelectedTab] = useState("search");
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);

  // Fetch trains from backend
  const fetchTrains = async () => {
    try {
      setLoading(true);
      const res = await api.get("/trains");
      setTrains(res.data);
    } catch (error) {
      console.error("Error fetching trains:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // For demonstration, we filter locally.
    const filtered = trains.filter(
      (train) =>
        train.source
          .toLowerCase()
          .includes(searchParams.source.toLowerCase()) &&
        train.destination
          .toLowerCase()
          .includes(searchParams.destination.toLowerCase())
    );
    setTrains(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-blue-700 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Train className="h-6 w-6" />
            <span className="text-2xl font-bold">TrainBooking</span>
          </div>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg transition ${
                selectedTab === "search" ? "bg-blue-800" : "hover:bg-blue-600"
              }`}
              onClick={() => setSelectedTab("search")}
            >
              Search Trains
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                selectedTab === "bookings" ? "bg-blue-800" : "hover:bg-blue-600"
              }`}
              onClick={() => setSelectedTab("bookings")}
            >
              My Bookings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {selectedTab === "search" && (
          <>
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      From Station
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter source station"
                        value={searchParams.source}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            source: e.target.value,
                          })
                        }
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      To Station
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter destination station"
                        value={searchParams.destination}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            destination: e.target.value,
                          })
                        }
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Journey Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={searchParams.date}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            date: e.target.value,
                          })
                        }
                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Search Trains</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            {/* Train Results */}
            {loading ? (
              <p className="text-center text-gray-500">Loading trains...</p>
            ) : (
              <div className="space-y-6">
                {trains.map((train) => (
                  <div
                    key={train.trainNumber}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {train.trainName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Train #{train.trainNumber}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {train.departureTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            {train.source}
                          </p>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {train.arrivalTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            {train.destination}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-green-600 text-lg">
                          {train.seatsAvailable} seats available
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            ₹{train.basePrice}
                          </p>
                          <p className="text-sm text-gray-500">Starting from</p>
                        </div>
                        <button
                          onClick={() => setSelectedTrain(train)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedTab === "bookings" && (
          <div>
            <p className="text-center text-gray-600">
              Booking history will appear here.
            </p>
          </div>
        )}
      </main>

      {/* Booking Form Modal */}
      {selectedTrain && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl max-h-screen overflow-y-auto">
            <button
              onClick={() => setSelectedTrain(null)}
              className="float-right text-gray-600 hover:text-gray-800 mb-4"
            >
              Close
            </button>
            <BookingForm
              trainDetails={selectedTrain}
              onBookingSuccess={(data) => {
                console.log("Booking successful:", data);
                setSelectedTrain(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainBookingApp;
