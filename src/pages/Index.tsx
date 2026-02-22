import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { AdminProvider } from '@/contexts/AdminContext';
import Header from '@/components/Header';
import NossaAreaPage from '@/components/NossaAreaPage';
import RelatoriosCriadosPage from '@/components/RelatoriosCriadosPage';
import FaqRelatoriosPage from '@/components/FaqRelatoriosPage';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState('area');

  const renderPage = () => {
    switch (activeTab) {
      case 'area':
        return <NossaAreaPage />;
      case 'portfolio':
        return <RelatoriosCriadosPage />;
      case 'faq':
        return <FaqRelatoriosPage />;
      default:
        return <NossaAreaPage />;
    }
  };

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="w-full px-6 lg:px-10 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="gradient-navy galaxy-bg mt-20 py-8 relative">
          <div className="relative z-10 px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} AeC - Diretoria de Pessoas — People Analytics
            </p>
            <div className="flex flex-col items-end gap-1">
              <p className="text-accent text-sm font-medium">Desenvolvido por Guilherme Santiago</p>
              <div className="flex items-center gap-4 text-primary-foreground/50 text-xs">
                <a href="https://wa.me/5538988690984" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>(38) 98869-0984</span>
                </a>
                <a href="mailto:m.guilherme.santiago@aec.com.br" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>m.guilherme.santiago@aec.com.br</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AdminProvider>
  );
};

export default Index;
