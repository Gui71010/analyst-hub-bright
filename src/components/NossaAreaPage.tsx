import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ImageIcon, MapPin } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AnalystCard from '@/components/AnalystCard';
import GalaxyParticles from '@/components/GalaxyParticles';
import BrazilMap from '@/components/BrazilMap';

const NossaAreaPage = () => {
  const { content, isAdmin, updateContent, addAnalyst } = useAdmin();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);

  const biAnalysts = content.analysts.filter((a) => a.type !== 'admin');
  const adminAnalysts = content.analysts.filter((a) => a.type === 'admin');

  const orgImage = content.orgChartUrl || '';

  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl gradient-navy p-10 md:p-16"
      >
        <GalaxyParticles />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-80 h-80 rounded-full bg-teal blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          {isAdmin ? (
            <input
              className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4 bg-transparent border-b border-primary-foreground/20 w-full outline-none focus:border-accent"
              value={content.areaTitle}
              onChange={(e) => updateContent({ areaTitle: e.target.value })}
            />
          ) : (
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              {content.areaTitle}
            </h2>
          )}
          <p className="text-accent text-lg font-medium mb-2">AeC - Diretoria de Pessoas - People Analytics</p>
          <p className="text-primary-foreground/40 text-sm mb-6">Equipe de Business Intelligence</p>
          {isAdmin ? (
            <textarea
              className="text-primary-foreground/80 leading-relaxed text-lg bg-transparent border border-primary-foreground/10 rounded-lg p-3 w-full min-h-[100px] outline-none focus:border-accent"
              value={content.areaDescription}
              onChange={(e) => updateContent({ areaDescription: e.target.value })}
            />
          ) : (
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {content.areaDescription}
            </p>
          )}
        </div>
      </motion.section>

      {/* Org Chart - only show if URL exists */}
      {(orgImage || isAdmin) && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card rounded-2xl p-4 overflow-hidden"
        >
          {isAdmin ? (
            <input
              className="text-2xl font-display font-bold text-foreground mb-4 px-4 pt-2 bg-transparent border-b border-border w-full outline-none focus:border-accent"
              value={content.orgChartTitle}
              onChange={(e) => updateContent({ orgChartTitle: e.target.value })}
            />
          ) : (
            <h3 className="text-2xl font-display font-bold text-foreground mb-4 px-4 pt-2">
              {content.orgChartTitle}
            </h3>
          )}
          {orgImage && <img src={orgImage} alt="Hierarquia do Setor" className="w-full rounded-xl" />}
          {isAdmin && (
            <div className="px-4 pb-4 pt-3 space-y-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> URL da imagem do organograma
              </label>
              <input
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm"
                value={content.orgChartUrl}
                onChange={(e) => updateContent({ orgChartUrl: e.target.value })}
                placeholder="Cole a URL da nova imagem do organograma"
              />
            </div>
          )}
        </motion.section>
      )}

      {/* About Us / O que fazemos - ENHANCED with larger text and gradient border */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-2xl gradient-accent opacity-[0.15]" />
        <div className="relative glass-card rounded-2xl p-10 md:p-14 border-2 border-accent/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            {isAdmin ? (
              <input
                className="text-3xl md:text-4xl font-display font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-accent"
                value={content.aboutUsTitle}
                onChange={(e) => updateContent({ aboutUsTitle: e.target.value })}
              />
            ) : (
              <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {content.aboutUsTitle}
              </h3>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Text content */}
            <div>
              {isAdmin ? (
                <textarea
                  className="text-foreground/80 leading-relaxed text-lg bg-transparent border border-border rounded-lg p-3 w-full min-h-[300px] outline-none focus:border-accent whitespace-pre-wrap"
                  value={content.aboutUsText}
                  onChange={(e) => updateContent({ aboutUsText: e.target.value })}
                />
              ) : (
                <div className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">
                  {content.aboutUsText}
                </div>
              )}
            </div>

            {/* Brazil Map */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
                <h4 className="font-display font-bold text-foreground text-lg">Nossas Localidades</h4>
              </div>
              <BrazilMap
                states={content.mapStates}
                onUpdateStates={(newStates) => updateContent({ mapStates: newStates })}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Analyst intro text - ENHANCED with larger and more prominent style */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.6 }}
        className="text-center py-8"
      >
        <div className="relative inline-block">
          <div className="absolute -inset-4 gradient-accent opacity-10 rounded-2xl blur-xl" />
          <div className="relative">
            {isAdmin ? (
              <textarea
                className="text-xl md:text-2xl text-foreground font-display font-semibold bg-transparent border border-border rounded-lg p-4 w-full max-w-3xl mx-auto min-h-[60px] outline-none focus:border-accent text-center"
                value={content.analystIntroText}
                onChange={(e) => updateContent({ analystIntroText: e.target.value })}
              />
            ) : (
              <p className="text-xl md:text-2xl text-foreground font-display font-semibold max-w-3xl mx-auto">
                {content.analystIntroText}
              </p>
            )}
            <div className="w-24 h-1 gradient-accent rounded-full mx-auto mt-4" />
          </div>
        </div>
      </motion.section>

      {/* Team Cards - BI Analysts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          {isAdmin ? (
            <input
              className="text-2xl font-display font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-accent"
              value={content.biAnalystsTitle}
              onChange={(e) => updateContent({ biAnalystsTitle: e.target.value })}
            />
          ) : (
            <h3 className="text-2xl font-display font-bold text-foreground">{content.biAnalystsTitle}</h3>
          )}
          {isAdmin && (
            <button
              onClick={() =>
                addAnalyst({
                  id: Date.now().toString(),
                  name: 'Novo Analista',
                  role: 'Analista de BI',
                  area: 'Nova Área',
                  photo: '',
                  bio: 'Descrição do analista.',
                  type: 'bi',
                })
              }
              className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {biAnalysts.map((analyst, i) => (
            <AnalystCard
              key={analyst.id}
              analyst={analyst}
              index={i}
              isSelected={selectedAnalyst === analyst.id}
              onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)}
              showDetails
              editable
              showClickHint
            />
          ))}
        </div>
      </motion.section>

      {/* Team Cards - Admin Analysts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          {isAdmin ? (
            <input
              className="text-2xl font-display font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-accent"
              value={content.adminAnalystsTitle}
              onChange={(e) => updateContent({ adminAnalystsTitle: e.target.value })}
            />
          ) : (
            <h3 className="text-2xl font-display font-bold text-foreground">{content.adminAnalystsTitle}</h3>
          )}
          {isAdmin && (
            <button
              onClick={() =>
                addAnalyst({
                  id: Date.now().toString(),
                  name: 'Novo Analista Admin',
                  role: 'Analista Administrativo',
                  area: 'Administrativo',
                  photo: '',
                  bio: 'Descrição do analista administrativo.',
                  type: 'admin',
                })
              }
              className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminAnalysts.map((analyst, i) => (
            <AnalystCard
              key={analyst.id}
              analyst={analyst}
              index={i}
              isSelected={selectedAnalyst === analyst.id}
              onClick={() => setSelectedAnalyst(selectedAnalyst === analyst.id ? null : analyst.id)}
              showDetails
              editable
              showClickHint
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default NossaAreaPage;
