import { useState } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { useCreateQualityProfileMutation } from '../../api/qualityApi';
import { toast } from 'react-hot-toast';

const QualityProfileForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    productGrade: 'A',
    parameters: [
      { name: 'Moisture Content', unit: '%', min: 0, max: 0, required: true }
    ],
    microbialSpecs: [
      { name: 'TPC', limit: '', required: true }
    ]
  });

  const [createProfile, { isLoading }] = useCreateQualityProfileMutation();

  const handleAddParam = () => {
    setFormData({
      ...formData,
      parameters: [...formData.parameters, { name: '', unit: '', min: 0, max: 0, required: true }]
    });
  };

  const handleRemoveParam = (index) => {
    const newParams = formData.parameters.filter((_, i) => i !== index);
    setFormData({ ...formData, parameters: newParams });
  };

  const handleAddMicrobial = () => {
    setFormData({
      ...formData,
      microbialSpecs: [...formData.microbialSpecs, { name: '', limit: '', required: true }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProfile(formData).unwrap();
      toast.success('Quality Profile created successfully');
      onClose();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create profile');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create Quality Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HiOutlineX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 font-medium"
                placeholder="e.g. Premium Export Grade"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Grade</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 font-medium"
                value={formData.productGrade}
                onChange={(e) => setFormData({ ...formData, productGrade: e.target.value })}
              >
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Standard)</option>
                <option value="C">Grade C (Commercial)</option>
              </select>
            </div>
          </div>

          {/* Regular Parameters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Physical/Chemical Parameters</h3>
              <button
                type="button"
                onClick={handleAddParam}
                className="text-primary-600 hover:text-primary-700 text-xs font-bold flex items-center gap-1"
              >
                <HiOutlinePlus /> Add Parameter
              </button>
            </div>
            {formData.parameters.map((param, index) => (
              <div key={index} className="flex items-end gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Parameter</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:border-primary-500 outline-none"
                    value={param.name}
                    onChange={(e) => {
                      const newParams = [...formData.parameters];
                      newParams[index].name = e.target.value;
                      setFormData({ ...formData, parameters: newParams });
                    }}
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Unit</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:border-primary-500 outline-none"
                    value={param.unit}
                    onChange={(e) => {
                      const newParams = [...formData.parameters];
                      newParams[index].unit = e.target.value;
                      setFormData({ ...formData, parameters: newParams });
                    }}
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:border-primary-500 outline-none"
                    value={param.min}
                    onChange={(e) => {
                      const newParams = [...formData.parameters];
                      newParams[index].min = parseFloat(e.target.value);
                      setFormData({ ...formData, parameters: newParams });
                    }}
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:border-primary-500 outline-none"
                    value={param.max}
                    onChange={(e) => {
                      const newParams = [...formData.parameters];
                      newParams[index].max = parseFloat(e.target.value);
                      setFormData({ ...formData, parameters: newParams });
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveParam(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Microbial Specs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Microbiological Specs</h3>
              <button
                type="button"
                onClick={handleAddMicrobial}
                className="text-primary-600 hover:text-primary-700 text-xs font-bold flex items-center gap-1"
              >
                <HiOutlinePlus /> Add Spec
              </button>
            </div>
            {formData.microbialSpecs.map((spec, index) => (
              <div key={index} className="flex items-end gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Test Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:border-primary-500 outline-none"
                    value={spec.name}
                    onChange={(e) => {
                      const newSpecs = [...formData.microbialSpecs];
                      newSpecs[index].name = e.target.value;
                      setFormData({ ...formData, microbialSpecs: newSpecs });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Limit</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:border-primary-500 outline-none"
                    placeholder="e.g. < 50,000 cfu/g"
                    value={spec.limit}
                    onChange={(e) => {
                      const newSpecs = [...formData.microbialSpecs];
                      newSpecs[index].limit = e.target.value;
                      setFormData({ ...formData, microbialSpecs: newSpecs });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default QualityProfileForm;
