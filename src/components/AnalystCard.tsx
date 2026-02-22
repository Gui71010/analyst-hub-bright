import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, User, MousePointerClick, X } from 'lucide-react';
import { Analyst, useAdmin } from '@/contexts/AdminContext';

interface AnalystCardProps {
  analyst: Analyst;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  editable?: boolean;
  size?: 'normal' | 'large';
  showClickHint?: boolean;
}

const AnalystCard = ({ analyst, index, isSelected, onClick, showDetails, editable, size = 'normal', showClickHint }: AnalystCardProps) => {
  const { isAdmin, updateAnalyst, removeAnalyst } = useAdmin();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.08 }}
        onClick={onClick}
        className={`glass-card rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl p-6 ${
          isSelected ? 'ring-2 ring-accent shadow-xl shadow-accent/10' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center w-16 h-16">
            {analyst.photo ? (
              <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-foreground truncate text-lg">{analyst.name}</h4>
            <p className="text-muted-foreground text-sm">{analyst.role}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full font-medium bg-accent/10 text-accent border border-accent/20 text-xs">
              {analyst.area}
            </span>
          </div>
        </div>

        {/* Click hint */}
        {showClickHint && !isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 mt-3 text-xs text-accent/70"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Clique para mais informações</span>
          </motion.div>
        )}
      </motion.div>

      {/* Full-screen modal when selected and showDetails is true */}
      <AnimatePresence>
        {showDetails && isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
            onClick={onClick}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={onClick}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Large photo + info header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-lg">
                    {analyst.photo ? (
                      <img src={analyst.photo} alt={analyst.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-3xl font-display font-bold text-foreground">{analyst.name}</h3>
                    <p className="text-lg text-muted-foreground mt-1">{analyst.role}</p>
                    <span className="inline-block mt-2 px-4 py-1 rounded-full font-medium bg-accent/10 text-accent border border-accent/20 text-sm">
                      {analyst.area}
                    </span>
                  </div>
                </div>

                {/* Bio or edit form */}
                {isAdmin && editable ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Nome</label>
                      <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.name} onChange={(e) => updateAnalyst(analyst.id, { name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Cargo</label>
                      <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.role} onChange={(e) => updateAnalyst(analyst.id, { role: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Área</label>
                      <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.area} onChange={(e) => updateAnalyst(analyst.id, { area: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">URL da Foto</label>
                      <input className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm" value={analyst.photo} onChange={(e) => updateAnalyst(analyst.id, { photo: e.target.value })} placeholder="Cole a URL da imagem aqui" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Bio</label>
                      <textarea className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm min-h-[80px]" value={analyst.bio} onChange={(e) => updateAnalyst(analyst.id, { bio: e.target.value })} />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeAnalyst(analyst.id); }} className="text-destructive text-sm hover:underline flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Remover analista
                    </button>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                    <p className="text-foreground leading-relaxed text-base">{analyst.bio}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalystCard;
