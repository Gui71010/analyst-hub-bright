import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Report, useAdmin } from '@/contexts/AdminContext';

interface ReportDetailModalProps {
  report: Report;
  creatorName: string;
  onClose: () => void;
  showMetrics?: boolean;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const ReportDetailModal = ({ report, creatorName, onClose, showMetrics = true, onNavigate, hasPrev, hasNext }: ReportDetailModalProps) => {
  const { isAdmin, updateReport, removeReport } = useAdmin();
  const [imgIndex, setImgIndex] = useState(0);
  const images = report.images.length > 0 ? report.images : [''];

  const nextImg = () => setImgIndex((p) => (p + 1) % images.length);
  const prevImg = () => setImgIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Navigation arrows OUTSIDE the card, inside the overlay with proper spacing */}
      {onNavigate && hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
          className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 shadow-2xl border border-navy-light/30 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}
      {onNavigate && hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
          className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80 shadow-2xl border border-navy-light/30 transition-all hover:scale-110"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative mx-16"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          {isAdmin ? (
            <input
              className="text-2xl font-display font-bold text-foreground bg-transparent border-b border-border w-full outline-none focus:border-accent"
              value={report.name}
              onChange={(e) => updateReport(report.id, { name: e.target.value })}
            />
          ) : (
            <h3 className="text-2xl font-display font-bold text-foreground">{report.name}</h3>
          )}
          <button onClick={onClose} className="shrink-0 ml-4 p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8 items-stretch">
          {/* Image carousel */}
          <div className="flex flex-col space-y-3">
            <div className="flex-1 bg-muted rounded-xl overflow-hidden relative min-h-[200px]">
              {images[imgIndex] ? (
                <img src={images[imgIndex]} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sem imagem</div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-primary-foreground hover:opacity-80">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === imgIndex ? 'bg-accent w-6' : 'bg-muted-foreground/30'}`} />
                ))}
              </div>
            )}
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">URLs das imagens (uma por linha)</label>
                <textarea
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[80px]"
                  value={report.images.join('\n')}
                  onChange={(e) => updateReport(report.id, { images: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Cole as URLs das imagens, uma por linha"
                />
              </div>
            )}
          </div>

          {/* Info side */}
          <div className="space-y-6">
            <div>
              <span className="text-xs text-muted-foreground">Criado por</span>
              <p className="text-accent font-medium">{creatorName}</p>
            </div>

            {isAdmin ? (
              <div>
                <label className="text-xs text-muted-foreground">Descrição</label>
                <textarea
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[80px]"
                  value={report.description}
                  onChange={(e) => updateReport(report.id, { description: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <span className="text-xs text-muted-foreground">Descrição</span>
                <p className="text-foreground leading-relaxed">{report.description}</p>
              </div>
            )}

            {showMetrics && (
              <div>
                <span className="text-xs text-muted-foreground mb-2 block">Métricas</span>
                {isAdmin ? (
                  <textarea
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[80px]"
                    value={report.metrics.join('\n')}
                    onChange={(e) => updateReport(report.id, { metrics: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Uma métrica por linha"
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {report.metrics.map((m, i) => (
                      <div key={i} className="px-4 py-3 rounded-lg bg-muted/50 border border-border text-sm font-medium text-foreground">
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">ID do Criador</label>
                <input
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  value={report.creatorId}
                  onChange={(e) => updateReport(report.id, { creatorId: e.target.value })}
                />
                <button
                  onClick={() => { removeReport(report.id); onClose(); }}
                  className="text-destructive text-sm hover:underline flex items-center gap-1 mt-2"
                >
                  <Trash2 className="w-3 h-3" /> Remover relatório
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailModal;
