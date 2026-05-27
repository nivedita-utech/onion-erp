import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlineCheck, HiOutlineXCircle } from 'react-icons/hi';
import { useGetQualityProfilesQuery, useCreateLabTestMutation } from '../../api/qualityApi';
import { useGetBatchesQuery } from '../../api/productionApi';
import { toast } from 'react-hot-toast';

const LabTestForm = ({ onClose }) => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [results, setResults] = useState([]);
  const [microbialResults, setMicrobialResults] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [overallStatus, setOverallStatus] = useState('Pass');

  const { data: batchesData } = useGetBatchesQuery(); // Remove status filter to show all batches
  const { data: profilesData } = useGetQualityProfilesQuery();
  const [createLabTest, { isLoading }] = useCreateLabTestMutation();

  const selectedProfile = profilesData?.data?.find(p => p._id === selectedProfileId);

  // Initialize results when profile changes
  useEffect(() => {
    if (selectedProfile) {
      setResults(selectedProfile.parameters.map(p => ({
        parameterName: p.name,
        value: 0,
        status: 'Pass'
      })));
      setMicrobialResults(selectedProfile.microbialSpecs.map(s => ({
        parameterName: s.name,
        value: '',
        status: 'Pass'
      })));
    }
  }, [selectedProfile]);

  const handleResultChange = (index, value) => {
    const newResults = [...results];
    const param = selectedProfile.parameters[index];
    const val = parseFloat(value);
    
    let status = 'Pass';
    if (param.min !== undefined && val < param.min) status = 'Fail';
    if (param.max !== undefined && val > param.max) status = 'Fail';
    
    newResults[index] = { ...newResults[index], value: val, status };
    setResults(newResults);
    
    // Auto-update overall status
    const anyFail = newResults.some(r => r.status === 'Fail') || microbialResults.some(r => r.status === 'Fail');
    setOverallStatus(anyFail ? 'Fail' : 'Pass');
  };

  const handleMicrobialChange = (index, value, status) => {
    const newMicrobial = [...microbialResults];
    newMicrobial[index] = { ...newMicrobial[index], value, status };
    setMicrobialResults(newMicrobial);
    
    const anyFail = results.some(r => r.status === 'Fail') || newMicrobial.some(r => r.status === 'Fail');
    setOverallStatus(anyFail ? 'Fail' : 'Pass');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !selectedProfileId) {
      return toast.error('Please select both batch and profile');
    }

    try {
      await createLabTest({
        batch: selectedBatch,
        profile: selectedProfileId,
        results,
        microbialResults,
        overallStatus,
        remarks
      }).unwrap();
      toast.success('Lab Test submitted successfully');
      onClose();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit lab test');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">New Lab Test Report</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95"
          >
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 ml-1">Select Batch</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-gray-900 font-semibold transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">Select a batch...</option>
                {batchesData?.data?.map(b => (
                  <option key={b._id} value={b._id}>{b.batchId} — {b.product?.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700 ml-1">Quality Profile</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-gray-900 font-semibold transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
              >
                <option value="">Select a profile...</option>
                {profilesData?.data?.map(p => (
                  <option key={p._id} value={p._id}>{p.name} (Grade {p.productGrade})</option>
                ))}
              </select>
            </div>
          </div>

          {selectedProfile && (
            <>
              {/* Parameters Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  Physical & Chemical Testing
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Parameter</th>
                        <th className="px-4 py-2 text-left">Range</th>
                        <th className="px-4 py-2 text-left">Actual Value</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedProfile.parameters.map((param, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">{param.name} ({param.unit})</td>
                          <td className="px-4 py-3 text-gray-500">
                             {param.min !== undefined && param.max !== undefined 
                               ? `${param.min} - ${param.max}` 
                               : param.min !== undefined ? `>= ${param.min}` : `<= ${param.max}`}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              required
                              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-900 font-bold focus:border-primary-500 outline-none transition-all"
                              value={results[idx]?.value || 0}
                              onChange={(e) => handleResultChange(idx, e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 font-bold ${results[idx]?.status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                              {results[idx]?.status === 'Pass' ? <HiOutlineCheck /> : <HiOutlineXCircle />}
                              {results[idx]?.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Microbial Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800">Microbiological Testing</h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Test</th>
                        <th className="px-4 py-2 text-left">Max Limit</th>
                        <th className="px-4 py-2 text-left">Result</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedProfile.microbialSpecs.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">{spec.name}</td>
                          <td className="px-4 py-3 text-gray-500">{spec.limit}</td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              required
                              className="w-40 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-900 font-bold focus:border-primary-500 outline-none transition-all"
                              placeholder="e.g. Absent"
                              value={microbialResults[idx]?.value || ''}
                              onChange={(e) => handleMicrobialChange(idx, e.target.value, microbialResults[idx]?.status)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 font-bold focus:border-primary-500 outline-none"
                              value={microbialResults[idx]?.status || 'Pass'}
                              onChange={(e) => handleMicrobialChange(idx, microbialResults[idx]?.value, e.target.value)}
                            >
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Remarks</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl h-24 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 transition-all"
              placeholder="Any additional observations..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall Status</p>
              <h4 className={`text-xl font-black ${overallStatus === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                {overallStatus.toUpperCase()}
              </h4>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl ${
                  overallStatus === 'Pass' 
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                }`}
              >
                {isLoading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default LabTestForm;
