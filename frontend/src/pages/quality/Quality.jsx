import { useState } from 'react';
import { 
  HiOutlinePlus, 
  HiOutlineBeaker, 
  HiOutlineDocumentDownload,
  HiOutlineAdjustments,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi';
import { useGetQualityProfilesQuery, useGetLabTestsQuery, useLazyDownloadCOAQuery } from '../../api/qualityApi';
import LabTestForm from './LabTestForm';
import QualityProfileForm from './QualityProfileForm';
import { toast } from 'react-hot-toast';

const Quality = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { data: testsData, isLoading: testsLoading } = useGetLabTestsQuery();
  const { data: profilesData, isLoading: profilesLoading } = useGetQualityProfilesQuery();
  const [downloadCOA] = useLazyDownloadCOAQuery();

  const handleDownload = async (test) => {
    const downloadPromise = async () => {
      try {
        const response = await downloadCOA(test._id).unwrap();
        // Create a new blob with the correct type to ensure the browser recognizes it as PDF
        const pdfBlob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `COA-${test.batch?.batchId || 'Report'}.pdf`;
        
        // Append, click and cleanup
        document.body.appendChild(link);
        link.click();
        
        // Small delay before cleanup to ensure trigger works in all browsers
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } catch (err) {
        throw new Error(err.message || 'Failed to generate PDF');
      }
    };

    toast.promise(downloadPromise(), {
      loading: 'Generating COA PDF...',
      success: 'Download started!',
      error: (err) => `Download failed: ${err.message}`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineBeaker className="text-primary-500" />
            Quality Assurance
          </h1>
          <p className="text-gray-500 mt-1">Manage product quality standards and lab test results.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <HiOutlineAdjustments />
            New Profile
          </button>
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow-primary-500/20"
          >
            <HiOutlinePlus />
            New Lab Test
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'tests' 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Lab Tests
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'profiles' 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Quality Profiles
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === 'tests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testsLoading ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading tests...</td></tr>
                ) : testsData?.data?.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No lab tests found.</td></tr>
                ) : (
                  testsData?.data?.map((test) => (
                    <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{test.batch?.batchId}</td>
                      <td className="px-6 py-4 text-gray-600">{test.profile?.name}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(test.testDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          test.overallStatus === 'Pass' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                        }`}>
                          {test.overallStatus === 'Pass' ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                          {test.overallStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDownload(test)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <HiOutlineDocumentDownload className="w-4 h-4" />
                          COA
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {profilesLoading ? (
              <div className="col-span-full py-10 text-center text-gray-500">Loading profiles...</div>
            ) : profilesData?.data?.map((profile) => (
              <div key={profile._id} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-primary-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{profile.name}</h3>
                  <span className="px-2 py-0.5 bg-gray-200 rounded text-[10px] font-bold text-gray-600 uppercase tracking-tight">Grade {profile.productGrade}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Parameters: {profile.parameters.length}</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.parameters.slice(0, 3).map(p => (
                      <span key={p.name} className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[10px] text-gray-600">{p.name}</span>
                    ))}
                    {profile.parameters.length > 3 && <span className="text-[10px] text-gray-400">+{profile.parameters.length - 3} more</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isTestModalOpen && <LabTestForm onClose={() => setIsTestModalOpen(false)} />}
      {isProfileModalOpen && <QualityProfileForm onClose={() => setIsProfileModalOpen(false)} />}
    </div>
  );
};

export default Quality;
