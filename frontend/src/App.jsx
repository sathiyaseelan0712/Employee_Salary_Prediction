import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css'; 

const SalaryPrediction = () => {
  const [formData, setFormData] = useState({
    companyId: '',
    jobType: '',
    degree: '',
    major: '',
    industry: '',
    yearsExperience: '',
    milesFromMetropolis: '',
  });
  const [options, setOptions] = useState({
    companies: [],
    jobTypes: [],
    degrees: [],
    majors: [],
    industries: []
  });
  const [predictedSalary, setPredictedSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://employee-salary-prediction-5lz69kfy2-sathiyaseelan-ss-projects.vercel.app/';
useEffect(() => {
    const fetchOptionsFromCSV = async () => {
      try {
        const response = await fetch('../data/distinct_values_col.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const companies = [...new Set(results.data.map(item => item.companies))];
            const jobTypes = [...new Set(results.data.map(item => item.jobTypes))];
            const degrees = [...new Set(results.data.map(item => item.degrees))];
            const majors = [...new Set(results.data.map(item => item.majors))];
            const industries = [...new Set(results.data.map(item => item.industries))];

            setOptions({
              companies,
              jobTypes,
              degrees,
              majors,
              industries
            });
          },
          error: (error) => {
            setError('Failed to parse CSV',error.message);
          }
        });
      } catch (error) {
        setError('Failed to fetch CSV',error.message);
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
      setPredictedSalary(data.predicted_salary);
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
    <div className="container">
      <h1>Employee Salary Prediction</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Company ID</label>
          <select name="companyId" value={formData.companyId} onChange={handleChange} required>
            <option value="">Select a company</option>
            {options.companies.map((company, index) => (
              <option key={index} value={company}>{company}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Job Type</label>
          <select name="jobType" value={formData.jobType} onChange={handleChange} required>
            <option value="">Select a job type</option>
            {options.jobTypes.map((jobType, index) => (
              <option key={index} value={jobType}>{jobType}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Degree</label>
          <select name="degree" value={formData.degree} onChange={handleChange} required>
            <option value="">Select a degree</option>
            {options.degrees.map((degree, index) => (
              <option key={index} value={degree}>{degree}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Major</label>
          <select name="major" value={formData.major} onChange={handleChange} required>
            <option value="">Select a major</option>
            {options.majors.map((major, index) => (
              <option key={index} value={major}>{major}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Industry</label>
          <select name="industry" value={formData.industry} onChange={handleChange} required>
            <option value="">Select an industry</option>
            {options.industries.map((industry, index) => (
              <option key={index} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Miles from Metropolis</label>
          <input
            type="number"
            name="milesFromMetropolis"
            value={formData.milesFromMetropolis}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Salary'}
        </button>
      </form>

      {error && <p className="error">Error: {error}</p>}
      {predictedSalary && (
        <p className="result">
          <strong>Predicted Salary: </strong>${predictedSalary.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default SalaryPrediction;
