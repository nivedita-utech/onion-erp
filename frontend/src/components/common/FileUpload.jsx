import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineCloudUpload, HiOutlineX, HiOutlineDocument } from 'react-icons/hi';

const FileUpload = ({ onUpload, accept = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
}, maxSize = 5242880 }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize
  });

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, i) => i !== indexToRemove));
  };

  const handleUploadClick = () => {
    if (onUpload) {
      onUpload(files);
      setFiles([]);
    }
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-gray-500 hover:border-gray-400 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center mb-4">
          <HiOutlineCloudUpload className={`w-12 h-12 ${isDragActive ? 'text-primary-400' : 'text-gray-400'}`} />
        </div>
        <p className="text-gray-300 font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-gray-500">
          Supported files: PDF, JPG, PNG, XLSX (Max 5MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={file.name + i} className="flex flex-wrap items-center justify-between glass-card p-3 rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 text-primary-400 rounded-md">
                  <HiOutlineDocument className="w-5 h-5"/>
                </div>
                <div>
                  <p className="text-sm text-gray-200">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
          ))}
          <div className="mt-4 flex justify-end">
             <button onClick={handleUploadClick} className="btn-primary text-sm">Upload {files.length} File{files.length > 1 ? 's' : ''}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
