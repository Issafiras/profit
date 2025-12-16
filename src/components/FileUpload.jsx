import { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({ onFileUpload }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      alert('Vælg venligst en CSV-fil');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('Filen er for stor (maks 50MB)');
      return;
    }

    onFileUpload(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
        ${isDragOver
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-gray-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{
            scale: isDragOver ? 1.1 : 1,
            rotate: isDragOver ? 5 : 0
          }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-primary-100 rounded-full"
        >
          <Upload className="w-12 h-12 text-primary-600" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Upload din CSV-fil
          </h3>
          <p className="text-gray-500">
            Træk og slip filen her, eller klik for at vælge
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FileText className="w-4 h-4" />
          <span>Understøtter .csv filer op til 50MB</span>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('fileInput').click()}
          className="btn-primary mt-4"
        >
          Vælg fil
        </motion.button>
      </div>
    </motion.div>
  );
}
