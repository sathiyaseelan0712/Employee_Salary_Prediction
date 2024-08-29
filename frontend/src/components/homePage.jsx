import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Popup from './popup'; // Make sure to import your Popup component
import Bg from '../images/bg6.jpg';

const SalaryPrediction = () => {
  const [formData, setFormData] = useState({
    jobType: '',
    degree: '',
    major: '',
    industry: '',
    yearsExperience: '',
    milesFromMetropolis: '',
  });
  const [options, setOptions] = useState({
    jobTypes: [],
    degrees: [],
    majors: [],
    industries: [],
  });
  const [predictedSalary, setPredictedSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const API_URL = 'https://employee-salary-prediction.onrender.com/predict';

  const quotes = [
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do.",
    "Your salary is your personal business. Your work is your public business.",
    "Money is a tool. Used properly it makes something beautiful; used wrong, it makes a mess!",
    "The best way to predict the future is to create it.",
    "Choose a job you love, and you will never have to work a day in your life.",
  ];

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  useEffect(() => {
    const fetchOptionsFromCSV = async () => {
      try {
        const response = await fetch('../data/distinct_values_col.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const jobTypes = [...new Set(results.data.map((item) => item.jobTypes))];
            const degrees = [...new Set(results.data.map((item) => item.degrees))];
            const majors = [...new Set(results.data.map((item) => item.majors))];
            const industries = [...new Set(results.data.map((item) => item.industries))];

            setOptions({
              jobTypes,
              degrees,
              majors,
              industries,
            });
          },
          error: (error) => {
            setError('Failed to parse CSV: ' + error.message);
          },
        });
      } catch (error) {
        setError('Failed to fetch CSV: ' + error.message);
      }
    };

    fetchOptionsFromCSV();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const predictSalary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to predict salary');
      }

      const data = await response.json();
      setPredictedSalary(data[0]); // Adjust based on actual response format
      setIsPopupVisible(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    predictSalary();
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center bg-cover bg-no-repeat bg-center bg-fixed"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="fixed w-full max-w-lg shadow rounded-lg p-4 sm:p-6 md:p-8 lg:p-10">
        <h1 className="text-[#FFC07C] text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-mono font-extrabold mb-4 sm:mb-6 text-center">
          EMPLOYEE SALARY PREDICTION
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Form fields */}
          <div>
            <label className="block text-[#FFC07C] text-sm font-mono sm:text-base font-extrabold mb-2" htmlFor="jobType">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="form-select w-full px-3 py-2 border font-mono bg-transparent rounded-md shadow-sm  text-white focus:outline-none focus:ring-[#e98d31] focus:border-[#e4af68] sm:text-sm"
              required
            >
              <option value="">Select a job type</option>
              {options.jobTypes.map((jobType, index) => (
                <option key={index} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#FFC07C] text-sm font-mono sm:text-base font-extrabold mb-2" htmlFor="degree">
              Degree
            </label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="form-select w-full px-3 py-2 border bg-transparent rounded-md font-mono shadow-sm  text-white focus:outline-none focus:ring-[#e98d31] focus:border-[#e4af68] sm:text-sm"
              required
            >
              <option value="">Select a degree</option>
              {options.degrees.map((degree, index) => (
                <option key={index} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#FFC07C] font-mono text-sm sm:text-base font-extrabold mb-2" htmlFor="major">
              Major
            </label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="form-select w-full px-3 py-2 border bg-transparent font-mono rounded-md shadow-sm  text-white focus:outline-none focus:ring-[#e98d31] focus:border-[#e4af68] sm:text-sm"
              required
            >
              <option value="">Select a major</option>
              {options.majors.map((major, index) => (
                <option key={index} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#FFC07C] text-sm font-mono sm:text-base font-extrabold mb-2" htmlFor="industry">
              Industry
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="form-select w-full px-3 py-2 border font-mono  bg-transparent rounded-md shadow-sm  text-white focus:outline-none focus:ring-[#e98d31] focus:border-[#e4af68] sm:text-sm"
              required
            >
              <option value="">Select an industry</option>
              {options.industries.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#FFC07C] text-sm font-mono sm:text-base font-extrabold mb-2" htmlFor="yearsExperience">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="form-input w-full px-3 py-2 border bg-transparent text-white font-mono rounded-md shadow-sm focus:outline-none focus:ring-[#FFC07C] focus:border-[#FFC07C] sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[#FFC07C] text-sm sm:text-base  font-mono font-extrabold mb-2" htmlFor="milesFromMetropolis">
              Miles from Metropolis
            </label>
            <input
              type="number"
              name="milesFromMetropolis"
              value={formData.milesFromMetropolis}
              onChange={handleChange}
              className="form-input w-full px-3 py-2 border bg-transparent text-white font-mono rounded-md shadow-sm focus:outline-none focus:ring-[#FFC07C] focus:border-[#FFC07C] sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-bold rounded-md shadow-sm ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } bg-[#FFC07C] hover:bg-[#FFC07C] focus:outline-none font-mono focus:ring-2 focus:ring-[#FFC07C] focus:ring-opacity-50`}
          >
            {loading ? 'Predicting...' : 'Predict Salary'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4 text-sm sm:text-base">
            Error: {error}
          </p>
        )}

        <Popup isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
          <p className="text-[#0e0904] text-center font-bold font-mono text-sm sm:text-base">
            <strong>Predicted Salary: </strong>${predictedSalary?.toFixed(2)}
          </p>
          <p className="text-[#000000] text-center font-mono font-bold text-sm sm:text-base mt-2">
            {getRandomQuote()}
          </p>
        </Popup>
      </div>
    </div>
  );
};

export default SalaryPrediction;
