import { useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { 
  HiOutlinePlus, HiOutlineKey, HiOutlineUser, HiOutlineMail, 
  HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineIdentification,
  HiOutlineBriefcase, HiOutlineCurrencyRupee, HiOutlineCalendar,
  HiOutlinePhone, HiOutlineMap, HiOutlineChevronRight, HiOutlineChevronLeft,
  HiOutlineEye, HiOutlineEyeOff, HiOutlineSearch
} from 'react-icons/hi';
import { useGetEmployeesQuery, useCreateEmployeeMutation } from '../../api/employeesApi';
import { useResetPasswordMutation } from '../../api/usersApi';
import { useGetRolesQuery } from '../../api/rolesApi';
import toast from 'react-hot-toast';

const Employees = () => {
  const { data, isLoading } = useGetEmployeesQuery();
  const [createEmployee] = useCreateEmployeeMutation();
  const [resetPassword] = useResetPasswordMutation();
  const { data: rolesData } = useGetRolesQuery();

  const [resetModal, setResetModal] = useState({ show: false, user: null });
  const [viewModal, setViewModal] = useState({ show: false, employee: null });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    employeeId: '',
    designation: '',
    department: '',
    salary: '',
    joiningDate: '',
    phone: '',
    address: '',
    dob: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        return toast.error('Please fill all account details');
      }
    }
    if (currentStep === 2) {
      if (!formData.employeeId || !formData.designation) {
        return toast.error('Please fill ID and Designation');
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(formData).unwrap();
      toast.success('Employee onboarded successfully!');
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      // Toast handled by apiSlice
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', password: '', role: '',
      employeeId: '', designation: '', department: '', salary: '', joiningDate: '',
      phone: '', address: '', dob: ''
    });
    setCurrentStep(1);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ id: resetModal.user._id, password: newPassword }).unwrap();
      toast.success('Password updated successfully');
      setResetModal({ show: false, user: null });
      setNewPassword('');
    } catch (err) {
      // Toast handled by apiSlice
    }
  };

  // Flatten data for table
  const tableData = useMemo(() => {
    return data?.data?.map(emp => ({
      ...emp,
      name: emp.user?.name || '—',
      email: emp.user?.email || '—',
      empId: emp.employeeId || '—',
      designation: emp.designation || '—',
      status: emp.user?.isActive ? 'active' : 'inactive',
      phone: emp.personalInfo?.phone || '—'
    })) || [];
  }, [data]);

  // Custom Status Badge for this page to match screenshot
  const EmployeeStatusBadge = ({ status }) => {
    if (status === 'active') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100 uppercase tracking-tight">
          Active
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-500 border border-blue-100 uppercase tracking-tight">
        Inactive
      </span>
    );
  };

  const columns = [
    { header: 'ID', accessor: 'empId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Department', accessor: 'department' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <EmployeeStatusBadge status={row.status} /> 
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewModal({ show: true, employee: row })}
            className="text-gray-400 hover:text-primary-500 transition-colors"
            title="View Details"
          >
            <HiOutlineEye className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button
            onClick={() => setResetModal({ show: true, user: row.user })}
            className="text-gray-400 hover:text-primary-500 transition-colors"
            title="Reset Password"
          >
            <HiOutlineKey className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      )
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTableData = useMemo(() => {
    if (!searchTerm) return tableData;
    return tableData.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tableData, searchTerm]);

  return (
    <div className="page-container max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <nav className="flex items-center gap-1 text-xs text-gray-400 mb-2 font-medium">
            <span className="hover:text-primary-500 cursor-pointer transition-colors">Employees</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Employees</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage employee records and attendance</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
        >
          <HiOutlinePlus className="w-5 h-5 stroke-[2.5]" />
          Add Employee
        </button>
      </div>

      <div className="space-y-6">
        {/* Search Bar - Matches Screenshot style */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="relative max-w-md group">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTableData}
          loading={isLoading}
          searchable={false} // Disable internal search as we have our own
          sortable
          pagination
          pageSize={10}
        />
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          title="Onboard New Employee"
          size="lg"
          onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        >
          {/* Enhanced Stepper */}
          <div className="relative mb-10 px-4">
            <div className="flex items-center justify-between relative z-10">
              {[1, 2, 3].map((step) => {
                const isActive = currentStep === step;
                const isCompleted = currentStep > step;
                const labels = ['Account', 'Professional', 'Personal'];
                const Icons = [HiOutlineUser, HiOutlineBriefcase, HiOutlineIdentification];
                const Icon = Icons[step - 1];

                return (
                  <div key={step} className="flex flex-col items-center relative gap-2">
                    <div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                        isActive 
                          ? 'bg-primary-500 text-white shadow-glow-lg scale-110 -translate-y-1' 
                          : isCompleted
                          ? 'bg-secondary-500 text-white'
                          : 'bg-surface-100 text-gray-400 border border-white/5'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                        isActive ? 'text-primary-500' : isCompleted ? 'text-secondary-400' : 'text-gray-500'
                      }`}>
                        {labels[step - 1]}
                      </span>
                      <span className={`text-[9px] font-medium transition-colors duration-300 ${
                        isActive ? 'text-primary-400/70' : 'text-gray-600'
                      }`}>
                        {step === 1 ? 'Login Info' : step === 2 ? 'Job Details' : 'Info'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Background Line */}
            <div className="absolute top-6 left-12 right-12 h-0.5 bg-gray-700/30 -z-0 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700 ease-out"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleAddEmployee} className="space-y-6">
            <div className="bg-white/5 dark:bg-black/20 rounded-2xl p-6 border border-white/5 shadow-inner">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="md:col-span-2 space-y-1 mb-2">
                    <h3 className="text-lg font-bold text-gradient">Account Credentials</h3>
                    <p className="text-sm text-gray-500">Create the digital identity for this employee.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Full Name</label>
                    <div className="relative group">
                      <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        className="input-field pl-11 shadow-sm"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. John Doe"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Email Address</label>
                    <div className="relative group">
                      <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        className="input-field pl-11 shadow-sm"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john.doe@onionerp.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Password</label>
                    <div className="relative group">
                      <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="password"
                        name="password"
                        className="input-field pl-11 shadow-sm"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Access Role</label>
                    <div className="relative group">
                      <HiOutlineShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors z-10" />
                      <select
                        name="role"
                        className="input-field pl-11 appearance-none shadow-sm cursor-pointer"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select System Role</option>
                        {rolesData?.data?.map(role => (
                          <option key={role._id} value={role._id}>
                            {role.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="md:col-span-2 space-y-1 mb-2">
                    <h3 className="text-lg font-bold text-gradient">Professional Profile</h3>
                    <p className="text-sm text-gray-500">Employment details and organizational identifiers.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Employee ID</label>
                    <div className="relative group">
                      <HiOutlineIdentification className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        name="employeeId"
                        className="input-field pl-11 shadow-sm"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. EMP-240"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Designation</label>
                    <div className="relative group">
                      <HiOutlineBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        name="designation"
                        className="input-field pl-11 shadow-sm"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Export Coordinator"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Department</label>
                    <div className="relative group">
                      <HiOutlineBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        name="department"
                        className="input-field pl-11 shadow-sm"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Operations"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Monthly Salary</label>
                    <div className="relative group">
                      <HiOutlineCurrencyRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="number"
                        name="salary"
                        className="input-field pl-11 shadow-sm"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="Amount in INR"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="input-label ml-1">Joining Date</label>
                    <div className="relative group">
                      <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors z-10" />
                      <input
                        type="date"
                        name="joiningDate"
                        className="input-field pl-11 cursor-pointer"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="md:col-span-2 space-y-1 mb-2">
                    <h3 className="text-lg font-bold text-gradient">Personal Information</h3>
                    <p className="text-sm text-gray-500">Contact detail and personal records.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Phone Number</label>
                    <div className="relative group">
                      <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        name="phone"
                        className="input-field pl-11 shadow-sm"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="input-label ml-1">Date of Birth</label>
                    <div className="relative group">
                      <HiOutlineCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors z-10" />
                      <input
                        type="date"
                        name="dob"
                        className="input-field pl-11 cursor-pointer"
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="input-label ml-1">Home Address</label>
                    <div className="relative group">
                      <HiOutlineMap className="absolute left-3.5 top-3 text-gray-500 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                      <textarea
                        name="address"
                        className="input-field pl-11 min-h-[100px] py-3 resize-none shadow-sm"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Complete permanent address..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                className={`btn-secondary group flex items-center gap-2 px-6 ${currentStep === 1 ? 'invisible' : ''}`}
                onClick={prevStep}
              >
                <HiOutlineChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Previous
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  className="btn-ghost px-6"
                  onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                >
                  Cancel
                </button>
                {currentStep < 3 ? (
                  <button type="button" className="btn-primary flex items-center gap-2 px-8" onClick={nextStep}>
                    Next Step
                    <HiOutlineChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button type="submit" className="btn-primary px-8 shadow-glow">
                    Complete Onboarding
                  </button>
                )}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {resetModal.show && (
        <Modal
          isOpen={resetModal.show}
          title={`Reset Password: ${resetModal.user?.name}`}
          onClose={() => { setResetModal({ show: false, user: null }); setNewPassword(''); setShowPassword(false); }}
        >
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="input-label ml-1">New Password</label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-11 pr-11 shadow-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setResetModal({ show: false, user: null }); setNewPassword(''); setShowPassword(false); }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </Modal>
      )}
      {/* View Employee Modal */}
      {viewModal.show && viewModal.employee && (
        <Modal
          isOpen={viewModal.show}
          title="Employee Profile Details"
          size="lg"
          onClose={() => setViewModal({ show: false, employee: null })}
        >
          <div className="space-y-8 pb-4">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold font-display shadow-glow">
                {viewModal.employee.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">{viewModal.employee.name}</h2>
                <p className="text-gray-400 font-medium">{viewModal.employee.designation}</p>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={viewModal.employee.status} />
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    {viewModal.employee.empId}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Professional Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary-400 border-b border-white/5 pb-2">
                  <HiOutlineBriefcase className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Professional Info</h3>
                </div>
                <div className="space-y-3 px-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Department</span>
                    <span className="text-gray-200 font-medium">{viewModal.employee.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Joining Date</span>
                    <span className="text-gray-200 font-medium">
                      {viewModal.employee.joiningDate ? new Date(viewModal.employee.joiningDate).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Salary</span>
                    <span className="text-gray-200 font-medium">
                      ₹{viewModal.employee.salary?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary-400 border-b border-white/5 pb-2">
                  <HiOutlineUser className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Personal Info</h3>
                </div>
                <div className="space-y-3 px-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-200 font-medium">{viewModal.employee.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-200 font-medium">{viewModal.employee.email}</span>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-1">
                    <span className="text-gray-500">Permanent Address</span>
                    <span className="text-gray-200 text-xs leading-relaxed">{viewModal.employee.personalInfo?.address || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                className="btn-primary px-8"
                onClick={() => setViewModal({ show: false, employee: null })}
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Employees;
