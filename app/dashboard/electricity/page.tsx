"use client";

import { useState } from 'react';
import Tesseract from 'tesseract.js';

// Region-specific emission factors (metric tons CO₂ per kWh)
const regionEmissionFactors = {
  global: 0.000707, // Global average
  india: 0.00082,   // India
  usa: 0.00043,     // United States
  eu: 0.00023,      // European Union
};

const ElectricityBillCalculator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<{
    name: string | null;
    billDate: string | null;
    billedUnits: number | null;
  }>({
    name: null,
    billDate: null,
    billedUnits: null,
  });
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('global'); // Default to global average

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const extractElectricityUsage = (text: string) => {
    console.log('OCR Text:', text); // Log the raw OCR text for debugging

    // Regex to extract Name
    const nameRegex = /Name:\s*([A-Z\s&]+)/i;
    const nameMatch = text.match(nameRegex);

    // Regex to extract Bill Date
    const billDateRegex = /Bill Date:\s*(\d{2}\.\d{2}\.\d{4})/i;
    const billDateMatch = text.match(billDateRegex);

    // Regex to extract Billed Units
    const billedUnitsRegex = /Billed Units\s*:\s*(\d+)/i;
    const billedUnitsMatch = text.match(billedUnitsRegex);

    // Log matches for debugging
    console.log('Name Match:', nameMatch);
    console.log('Bill Date Match:', billDateMatch);
    console.log('Billed Units Match:', billedUnitsMatch);

    // Extract and return relevant information
    return {
      name: nameMatch ? nameMatch[1].trim() : null,
      billDate: billDateMatch ? billDateMatch[1] : null,
      billedUnits: billedUnitsMatch ? parseInt(billedUnitsMatch[1]) : null,
    };
  };

  const processBill = async () => {
    if (!file) return;

    setLoading(true);

    try {
      // Perform OCR on the uploaded image
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => console.log(m),
        }
      );

      // Extract relevant information from the OCR text
      const extractedData = extractElectricityUsage(text);
      setExtractedInfo(extractedData);

      // Log extracted data for debugging
      console.log('Extracted Data:', extractedData);
    } catch (error) {
      console.error('Error processing the bill:', error);
      alert('An error occurred while processing the bill.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate carbon footprint based on region-specific emission factor
  const carbonFootprint = extractedInfo.billedUnits
    ? extractedInfo.billedUnits * regionEmissionFactors[region]
    : null;

  // Personalized recommendations
  const recommendations = [
    'Switch to LED bulbs to save up to 75% on lighting energy.',
    'Use energy-efficient appliances to reduce your carbon footprint.',
    'Consider installing solar panels to offset your electricity usage.',
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Electricity Bill Carbon Footprint Calculator</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ marginBottom: '20px' }}>
        <label>Select Region: </label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="global">Global Average</option>
          <option value="india">India</option>
          <option value="usa">United States</option>
          <option value="eu">European Union</option>
        </select>
      </div>
      <button
        onClick={processBill}
        disabled={!file || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Processing...' : 'Process Bill'}
      </button>

      {extractedInfo.billedUnits !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2>Extracted Information:</h2>
          <p><strong>Name:</strong> {extractedInfo.name || 'Not found'}</p>
          <p><strong>Bill Date:</strong> {extractedInfo.billDate || 'Not found'}</p>
          <p><strong>Billed Units:</strong> {extractedInfo.billedUnits || 'Not found'} kWh</p>

          <h2>Carbon Footprint:</h2>
          <p>
            {carbonFootprint?.toFixed(3)} metric tons CO2
          </p>

          {/* Personalized Recommendations */}
          <div style={{ marginTop: '20px' }}>
            <h3>Personalized Recommendations</h3>
            <ul>
              {recommendations.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityBillCalculator;