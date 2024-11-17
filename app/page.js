```javascript
'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [closureText, setClosureText] = useState('');

  const parseClosureText = (text) => {
    let jobData = {
      date: new Date().toISOString().split('T')[0],
      totalAmount: 0,
      parts: 0,
      technicianPercentage: 35,
      paymentMethod: 'cc',
      zipCode: '',
      jobId: '',
      customerName: '',
      jobType: ''
    };

    // Get amount
    const amountMatch = text.match(/Close\s+\$?(\d+)/i);
    if (amountMatch) {
      jobData.totalAmount = parseFloat(amountMatch[1]);
    }

    // Get parts cost
    const partsMatch = text.match(/Tech part\s+\$?(\d+)/i);
    if (partsMatch) {
      jobData.parts = parseFloat(partsMatch[1]);
    }

    // Get payment method
    const payMatch = text.match(/Pay\s+(\w+)/i);
    if (payMatch) {
      jobData.paymentMethod = payMatch[1].toLowerCase();
    }

    // Get ZIP code
    const zipMatch = text.match(/\b\d{5}\b/);
    if (zipMatch) {
      jobData.zipCode = zipMatch[0];
    }

    // Get job ID
    const jobIdMatch = text.match(/job-(\d+)/i);
    if (jobIdMatch) {
      jobData.jobId = jobIdMatch[1];
    }

    // Get customer name
    const nameMatch = text.match(/Name:\s+([^\n]+)/);
    if (nameMatch) {
      jobData.customerName = nameMatch[1];
    }

    // Get job type
    const jobTypeMatch = text.match(/Job Type:\s+([^\n]+)/);
    if (jobTypeMatch) {
      jobData.jobType = jobTypeMatch[1];
    }

    return jobData;
  };

  const addJobFromClosure = () => {
    if (!closureText.trim()) return;

    const jobData = parseClosureText(closureText);
    const technicianProfit = calculateTechnicianProfit(
      jobData.totalAmount,
      jobData.parts,
      jobData.technicianPercentage
    );

    setJobs([...jobs, {
      ...jobData,
      id: Date.now(),
      technicianProfit
    }]);

    setClosureText('');
  };

  const calculateTechnicianProfit = (total, parts, percentage) => {
    const profit = (total - parts) * (percentage / 100);
    return Math.round(profit * 100) / 100;
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const calculateTotals = () => {
    return jobs.reduce((acc, job) => ({
      totalJobs: acc.totalJobs + 1,
      totalSales: acc.totalSales + Number(job.totalAmount),
      totalParts: acc.totalParts + Number(job.parts),
      totalTechnicianProfit: acc.totalTechnicianProfit + job.technicianProfit
    }), {
      totalJobs: 0,
      totalSales: 0,
      totalParts: 0,
      totalTechnicianProfit: 0
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">New Job Entry</h2>
        <div className="space-y-4">
          <textarea
            value={closureText}
            onChange={(e) => setClosureText(e.target.value)}
            placeholder="Paste job closure text here..."
            className="w-full min-h-[200px] p-2 border rounded-lg"
          />
          <button
            onClick={addJobFromClosure}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Add Job
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold p-6">Jobs List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Job ID</th>
                <th className="text-left p-4">ZIP</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Parts</th>
                <th className="text-left p-4">Tech %</th>
                <th className="text-left p-4">Tech Profit</th>
                <th className="text-left p-4">Payment</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-t">
                  <td className="p-4">{job.date}</td>
                  <td className="p-4">{job.jobId}</td>
                  <td className="p-4">{job.zipCode}</td>
                  <td className="p-4">{job.jobType}</td>
                  <td className="p-4">${job.totalAmount}</td>
                  <td className="p-4">${job.parts}</td>
                  <td className="p-4">{job.technicianPercentage}%</td>
                  <td className="p-4">${job.technicianProfit}</td>
                  <td className="p-4">{job.paymentMethod}</td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(calculateTotals()).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-lg font-semibold">
                {key.includes('total') && !key.includes('Jobs') ? '$' : ''}
                {Math.round(value * 100) / 100}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```​​​​​​​​​​​​
