import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    frequency: 'daily',
    basePrice: '',
    totalSeats: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  // Fetch trains from backend
  const fetchTrains = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trains');
      setTrains(res.data);
    } catch (error) {
      console.error('Error fetching trains:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleEdit = (train) => {
    setSelectedTrain(train);
    setFormData(train);
    setShowModal(true);
  };

  const handleDelete = async (trainId) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      try {
        await api.delete(`/trains/${trainId}`);
        fetchTrains();
      } catch (error) {
        console.error('Error deleting train:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTrain) {
        await api.put(`/trains/${selectedTrain.id}`, formData);
      } else {
        await api.post('/trains', formData);
      }
      fetchTrains();
      setShowModal(false);
      setSelectedTrain(null);
      setFormData({
        trainNumber: '',
        trainName: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        frequency: 'daily',
        basePrice: '',
        totalSeats: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error submitting train:', error);
    }
  };

  const filteredTrains = trains.filter(
    (train) =>
      train.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.trainNumber.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Train Management</h2>
          <button
            onClick={() => {
              setSelectedTrain(null);
              setFormData({
                trainNumber: '',
                trainName: '',
                source: '',
                destination: '',
                departureTime: '',
                arrivalTime: '',
                frequency: 'daily',
                basePrice: '',
                totalSeats: '',
                status: 'active'
              });
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Train</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search trains by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Train List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading trains...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Train Details
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Capacity & Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrains.map((train) => (
                  <tr key={train.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-800">
                        {train.trainName}
                      </div>
                      <div className="text-xs text-gray-500">#{train.trainNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {train.source} to {train.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{train.departureTime}</div>
                      <div className="text-xs text-gray-500">{train.frequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">₹{train.basePrice}</div>
                      <div className="text-xs text-gray-500">{train.totalSeats} seats</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                          train.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {train.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleEdit(train)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(train.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for adding/editing train */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedTrain ? 'Edit Train' : 'Add New Train'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Train Number</label>
                <input
                  type="text"
                  value={formData.trainNumber}
                  onChange={(e) => setFormData({ ...formData, trainNumber: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Train Name</label>
                <input
                  type="text"
                  value={formData.trainName}
                  onChange={(e) => setFormData({ ...formData, trainName: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                  <input
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Price</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {selectedTrain ? 'Update Train' : 'Add Train'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
