import React, { useState } from 'react';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import UserSidebar from '../components/UserSidebar';
import { ToastContainer } from 'react-toastify';

function Feedback() {
  const [feedback, setFeedback] = useState('');

  // Handle feedback change
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Handle feedback submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    // Check if feedback is empty before submitting
    if (!feedback.trim()) {
      return handleError('Please provide your feedback before submitting.');
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/user/feedback", // Replace with your backend URL
        { message: feedback }, // Send the feedback data
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Fetch token from localStorage
          },
        }
      );

      if (data?.success) {
        handleSuccess('Feedback submitted successfully');
        setFeedback(''); // Reset feedback input field
      } else {
        handleError(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      handleError('Error submitting feedback. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <UserSidebar />
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6">Submit Feedback</h1>

        {/* Feedback Form */}
        <form onSubmit={handleSubmitFeedback} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="feedback">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              placeholder="Write your feedback here..."
            />
          </div>

          {/* Error and Success Messages */}
          <div className="mt-4">
            {/* Optionally display success or error message */}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Feedback;
