"use client";

import { useState } from 'react';
import Tesseract from 'tesseract.js';

// Updated emission factors in kg CO2/kWh (source: IEA, Ember, etc.)
const defaultEmissionFactors = {
  global: 0.475,   // Global average (kg CO2/kWh)
  india: 0.42,     // India (kg CO2/kWh)
  usa: 0.43,       // United States (kg CO2/kWh)
  eu: 0.23,        // European Union (kg CO2/kWh)
};

const ElectricityBillCalculator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedInfo, setExtractedInfo] = useState({
    name: null,
    billDate: null,
    billedUnits: null,
  });
  const [manualUnits, setManualUnits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState('global');
  const [customEmissionFactor, setCustomEmissionFactor] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const extractElectricityUsage = (text: string) => {
    const nameRegex = /Name:\s*([A-Z\s&]+)/i;
    const billDateRegex = /Bill Date:\s*(\d{2}\.\d{2}\.\d{4})/i;
    const billedUnitsRegex = /Billed Units\s*:\s*(\d+)/i;

    return {
      name: text.match(nameRegex)?.[1]?.trim() || null,
      billDate: text.match(billDateRegex)?.[1] || null,
      billedUnits: text.match(billedUnitsRegex) ? parseInt(text.match(billedUnitsRegex)[1]) : null,
    };
  };

  const processBill = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      setExtractedInfo(extractElectricityUsage(text));
    } catch (error) {
      alert('Error processing the bill.');
    } finally {
      setLoading(false);
    }
  };

  const billedUnits = extractedInfo.billedUnits ?? manualUnits;
  const emissionFactor = customEmissionFactor ?? defaultEmissionFactors[region];
  const carbonFootprint = billedUnits ? billedUnits * emissionFactor : null;
  const recommendations = [
    'Switch to LED bulbs to save energy.',
    'Use energy-efficient appliances.',
    'Consider installing solar panels.',
  ];

  return (
    <div className="flex justify-center items-start min-h-screen bg-white p-6 pt-16">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border-2 border-green-500">
        <h1 className="text-gray-700 text-xl font-bold mb-4 text-center">Electricity Bill Carbon Footprint Calculator</h1>
        <div className="p-4 bg-white border border-green-500 rounded-lg space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-green-500 p-2 rounded-lg bg-white"
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-green-500 p-2 rounded-lg bg-white"
          >
            <option value="global">Global Average</option>
            <option value="india">India</option>
            <option value="usa">United States</option>
            <option value="eu">European Union</option>
          </select>
         
          <button
            onClick={processBill}
            disabled={!file || loading}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:bg-green-400"
          >
            {loading ? 'Processing...' : 'Process Bill'}
          </button>
          {extractedInfo.billedUnits === null && (
            <input
              type="number"
              placeholder="Enter billed units manually"
              value={manualUnits ?? ''}
              onChange={(e) => setManualUnits(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border border-green-500 p-2 rounded-lg bg-white"
            />
          )}
        </div>
        {billedUnits !== null && (
          <div className="mt-4 p-4 bg-white border border-green-500 rounded-lg">
            <h2 className="text-gray-700 font-bold">Extracted Information:</h2>
            <p><strong>Name:</strong> {extractedInfo.name || 'Not found'}</p>
            <p><strong>Bill Date:</strong> {extractedInfo.billDate || 'Not found'}</p>
            <p><strong>Billed Units:</strong> {billedUnits} kWh</p>
            <h2 className="text-gray-700 font-bold mt-2">Carbon Footprint:</h2>
            <p>{carbonFootprint?.toFixed(3)} kg CO₂e</p>
            <div className="mt-2">
              <h3 className="text-gray-700 font-bold">Recommendations:</h3>
              <ul className="list-disc pl-5">
                {recommendations.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectricityBillCalculator;