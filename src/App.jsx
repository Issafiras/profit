import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Package, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react';
import FileUpload from './components/FileUpload';
import StatsCard from './components/StatsCard';
import DataTable from './components/DataTable';
import {
  calculateMetrics,
  findCashCows,
  findLagerGuld,
  findTabsListe,
  formatCurrency
} from './utils/dataProcessor';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = useCallback((file) => {
    setIsLoading(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processed = results.data
          .map(calculateMetrics)
          .filter(item => item !== null);

        const cashCows = findCashCows(processed);
        const lagerGuld = findLagerGuld(processed);
        const tabsListe = findTabsListe(processed);

        const totalProfit = processed.reduce((sum, item) => sum + item.realProfit, 0);
        const avgProfit = processed.length > 0 ? totalProfit / processed.length : 0;

        setProcessedData({
          all: processed,
          cashCows,
          lagerGuld,
          tabsListe,
          stats: {
            totalProducts: processed.length,
            totalProfit,
            avgProfit,
            profitableProducts: processed.filter(p => p.realProfit > 0).length,
            lossProducts: tabsListe.length
          }
        });

        setIsLoading(false);
      },
      error: (error) => {
        console.error('CSV Parse Error:', error);
        alert('Fejl ved læsning af CSV-fil. Tjek filformatet.');
        setIsLoading(false);
      }
    });
  }, []);

  const handleReset = () => {
    setProcessedData(null);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <BarChart3 className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Salgsanalyse Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyser dine salgsdata hurtigt og effektivt. Upload din CSV-fil for at få øjeblikkelig indsigt i din forretning.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!processedData ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <FileUpload onFileUpload={handleFileUpload} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Analyse Resultater</h2>
                  <p className="text-gray-600 mt-1">Fil: {fileName}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  Upload ny fil
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  icon={Package}
                  title="Total Produkter"
                  value={processedData.stats.totalProducts}
                  color="primary"
                  delay={0.1}
                />
                <StatsCard
                  icon={DollarSign}
                  title="Total Fortjeneste"
                  value={formatCurrency(processedData.stats.totalProfit)}
                  subtitle={`Gns: ${formatCurrency(processedData.stats.avgProfit)}`}
                  color="success"
                  delay={0.2}
                />
                <StatsCard
                  icon={TrendingUp}
                  title="Profitable Produkter"
                  value={processedData.stats.profitableProducts}
                  subtitle={`${Math.round((processedData.stats.profitableProducts / processedData.stats.totalProducts) * 100)}% af total`}
                  color="success"
                  delay={0.3}
                />
                <StatsCard
                  icon={AlertTriangle}
                  title="Tabsgivende Produkter"
                  value={processedData.stats.lossProducts}
                  subtitle="Kræver opmærksomhed"
                  color="danger"
                  delay={0.4}
                />
              </div>

              <div className="space-y-8">
                <DataTable
                  data={processedData.cashCows}
                  title="Cash Cows - Top 10 Fortjeneste"
                  icon={TrendingUp}
                  color="success"
                />

                {processedData.lagerGuld.length > 0 && (
                  <DataTable
                    data={processedData.lagerGuld}
                    title="Lager-Guld - Sælg nu!"
                    icon={Package}
                    color="warning"
                  />
                )}

                {processedData.tabsListe.length > 0 && (
                  <DataTable
                    data={processedData.tabsListe}
                    title="Tabs-liste - Pas på!"
                    icon={AlertTriangle}
                    color="danger"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-lg font-medium text-gray-900">Behandler data...</p>
                <p className="text-sm text-gray-500 text-center">
                  Dette kan tage et øjeblik afhængigt af filstørrelsen
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
