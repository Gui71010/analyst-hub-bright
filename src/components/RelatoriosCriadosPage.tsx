import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import ReportCard from '@/components/ReportCard';
import ReportDetailModal from '@/components/ReportDetailModal';
import GalaxyParticles from '@/components/GalaxyParticles';

const RelatoriosCriadosPage = () => {
  const { content, isAdmin, updateContent, updateAnalyst, addReport } = useAdmin();
  const [selectedAnalystId, setSelectedAnalystId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const biAnalysts = content.analysts.filter((a) => a.type !== 'admin');

  const filteredReports = selectedAnalystId
    ? content.reports.filter((r) => r.creatorId === selectedAnalystId)
    : content.reports;

  const getCreatorName = (id: string) => content.analysts.find((a) => a.id === id)?.name || 'Desconhecido';

  const selectedReport = content.reports.find((r) => r.id === selectedReportId);

  const navigateReport = (direction: 'prev' | 'next') => {
    const idx = filteredReports.findIndex((r) => r.id === selectedReportId);
    if (idx === -1) return;
    const newIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < filteredReports.length) {
      setSelectedReportId(filteredReports[newIdx].id);
    }
  };

  const currentIdx = filteredReports.findIndex((r) => r.id === selectedReportId);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16"
      >
        <GalaxyParticles />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          {isAdmin ? (
            <input
              className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent"
              value={content.portfolioTitle}
              onChange={(e) => updateContent({ portfolioTitle: e.target.value })}
            />
          ) : (
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              {content.portfolioTitle}
            </h2>
          )}
          {isAdmin ? (
            <input
              className="text-accent text-sm font-medium mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent block"
              value={content.portfolioSubtitle}
              onChange={(e) => updateContent({ portfolioSubtitle: e.target.value })}
            />
          ) : (
            <p className="text-accent text-sm font-medium mb-4">{content.portfolioSubtitle}</p>
          )}
          {isAdmin ? (
            <textarea
              className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[80px] outline-none focus:border-accent"
              value={content.portfolioDescription}
              onChange={(e) => updateContent({ portfolioDescription: e.target.value })}
            />
          ) : (
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {content.portfolioDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Analyst filter - IMPROVED: bigger, more beautiful buttons */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {isAdmin ? (
          <input
            className="text-xl font-display font-bold text-foreground mb-6 bg-transparent border-b border-border outline-none focus:border-accent block"
            value={content.filterByAnalystTitle}
            onChange={(e) => updateContent({ filterByAnalystTitle: e.target.value })}
          />
        ) : (
          <h3 className="text-xl font-display font-bold text-foreground mb-6">{content.filterByAnalystTitle}</h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* All button */}
          <button
            onClick={() => setSelectedAnalystId(null)}
            className={`flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-all duration-300 ${
              !selectedAnalystId
                ? 'gradient-accent text-accent-foreground shadow-xl shadow-accent/20 scale-[1.02]'
                : 'glass-card text-foreground hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <span className="text-lg">Todos</span>
          </button>

          {biAnalysts.map((a) => (
            <div key={a.id} className="relative group">
              <button
                onClick={() => setSelectedAnalystId(selectedAnalystId === a.id ? null : a.id)}
                className={`w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-base font-medium transition-all duration-300 ${
                  selectedAnalystId === a.id
                    ? 'gradient-accent text-accent-foreground shadow-xl shadow-accent/20 scale-[1.02]'
                    : 'glass-card text-foreground hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center border-2 border-accent/20">
                  {a.photo ? (
                    <img src={a.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="block font-display font-semibold text-base leading-tight truncate">{a.name}</span>
                  <span className={`text-sm block leading-tight mt-1 ${
                    selectedAnalystId === a.id ? 'text-accent-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {a.role}
                  </span>
                  <span className={`text-xs block mt-0.5 ${
                    selectedAnalystId === a.id ? 'text-accent-foreground/50' : 'text-accent'
                  }`}>
                    {a.area}
                  </span>
                </div>
              </button>
              {isAdmin && (
                <div className="absolute top-full left-0 mt-1 z-20 hidden group-hover:block">
                  <div className="glass-card rounded-lg p-3 shadow-xl w-64 space-y-2">
                    <label className="text-xs text-muted-foreground">URL da Foto</label>
                    <input
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs"
                      value={a.photo}
                      onChange={(e) => updateAnalyst(a.id, { photo: e.target.value })}
                      placeholder="Cole a URL da imagem"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Reports grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-foreground">
            {filteredReports.length} relatório{filteredReports.length !== 1 ? 's' : ''}
          </h3>
          {isAdmin && (
            <button
              onClick={() =>
                addReport({
                  id: Date.now().toString(),
                  name: 'Novo Relatório',
                  creatorId: biAnalysts[0]?.id || '',
                  description: 'Descrição do relatório.',
                  images: [],
                  metrics: [],
                })
              }
              className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredReports.map((report, i) => (
              <ReportCard
                key={report.id}
                report={report}
                creatorName={getCreatorName(report.creatorId)}
                index={i}
                onClick={() => setSelectedReportId(report.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Report detail modal with navigation */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            creatorName={getCreatorName(selectedReport.creatorId)}
            onClose={() => setSelectedReportId(null)}
            showMetrics={false}
            onNavigate={navigateReport}
            hasPrev={currentIdx > 0}
            hasNext={currentIdx < filteredReports.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RelatoriosCriadosPage;
