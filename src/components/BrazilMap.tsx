import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapState, MapCity, useAdmin } from '@/contexts/AdminContext';
import { Plus, Trash2, X } from 'lucide-react';

// SVG paths for Brazilian states
const STATE_PATHS: Record<string, string> = {
  AC: 'M48,195 L65,195 L65,215 L48,215 Z',
  AM: 'M60,140 L140,140 L140,195 L60,195 Z',
  RR: 'M80,90 L115,90 L115,140 L80,140 Z',
  PA: 'M140,120 L230,120 L230,185 L140,185 Z',
  AP: 'M195,85 L225,85 L225,120 L195,120 Z',
  TO: 'M205,185 L235,185 L235,245 L205,245 Z',
  MA: 'M230,145 L275,145 L275,190 L230,190 Z',
  PI: 'M260,170 L290,170 L290,220 L260,220 Z',
  CE: 'M290,150 L325,150 L325,185 L290,185 Z',
  RN: 'M325,155 L355,155 L355,175 L325,175 Z',
  PB: 'M320,175 L355,175 L355,195 L320,195 Z',
  PE: 'M295,195 L350,195 L350,215 L295,215 Z',
  AL: 'M330,215 L355,215 L355,235 L330,235 Z',
  SE: 'M320,235 L345,235 L345,250 L320,250 Z',
  BA: 'M260,220 L330,220 L330,310 L260,310 Z',
  MG: 'M210,270 L290,270 L290,340 L210,340 Z',
  ES: 'M290,300 L315,300 L315,335 L290,335 Z',
  RJ: 'M265,340 L305,340 L305,365 L265,365 Z',
  SP: 'M195,330 L265,330 L265,375 L195,375 Z',
  PR: 'M175,370 L240,370 L240,405 L175,405 Z',
  SC: 'M195,405 L240,405 L240,435 L195,435 Z',
  RS: 'M170,430 L230,430 L230,490 L170,490 Z',
  MS: 'M150,290 L210,290 L210,360 L150,360 Z',
  MT: 'M115,200 L205,200 L205,290 L115,290 Z',
  GO: 'M185,255 L235,255 L235,320 L185,320 Z',
  DF: 'M220,280 L235,280 L235,290 L220,290 Z',
  RO: 'M65,215 L115,215 L115,255 L65,255 Z',
};

interface BrazilMapProps {
  states: MapState[];
  onUpdateStates?: (states: MapState[]) => void;
}

const BrazilMap = ({ states, onUpdateStates }: BrazilMapProps) => {
  const { isAdmin } = useAdmin();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [editingState, setEditingState] = useState<string | null>(null);

  const activeStateCodes = states.map(s => s.stateCode);

  const getStateData = (code: string) => states.find(s => s.stateCode === code);

  const handleMouseMove = (e: React.MouseEvent, code: string) => {
    if (activeStateCodes.includes(code)) {
      const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      setHoveredState(code);
    }
  };

  const hoveredData = hoveredState ? getStateData(hoveredState) : null;

  const addState = (code: string) => {
    if (!onUpdateStates) return;
    const stateName = code; // simplified
    const newState: MapState = {
      id: Date.now().toString(),
      stateCode: code,
      stateName,
      cities: [],
    };
    onUpdateStates([...states, newState]);
  };

  const removeState = (id: string) => {
    if (!onUpdateStates) return;
    onUpdateStates(states.filter(s => s.id !== id));
  };

  const updateState = (id: string, data: Partial<MapState>) => {
    if (!onUpdateStates) return;
    onUpdateStates(states.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const addCity = (stateId: string) => {
    const state = states.find(s => s.id === stateId);
    if (!state || !onUpdateStates) return;
    const newCity: MapCity = { id: Date.now().toString(), name: 'Nova Cidade', imageUrl: '' };
    updateState(stateId, { cities: [...state.cities, newCity] });
  };

  const updateCity = (stateId: string, cityId: string, data: Partial<MapCity>) => {
    const state = states.find(s => s.id === stateId);
    if (!state || !onUpdateStates) return;
    updateState(stateId, {
      cities: state.cities.map(c => c.id === cityId ? { ...c, ...data } : c),
    });
  };

  const removeCity = (stateId: string, cityId: string) => {
    const state = states.find(s => s.id === stateId);
    if (!state || !onUpdateStates) return;
    updateState(stateId, { cities: state.cities.filter(c => c.id !== cityId) });
  };

  return (
    <div className="relative">
      <div className="relative inline-block w-full max-w-md mx-auto">
        <svg viewBox="30 70 350 440" className="w-full h-auto">
          {Object.entries(STATE_PATHS).map(([code, path]) => {
            const isActive = activeStateCodes.includes(code);
            const isHovered = hoveredState === code;
            return (
              <path
                key={code}
                d={path}
                fill={isActive ? (isHovered ? 'hsl(200, 80%, 50%)' : 'hsl(200, 70%, 75%)') : 'hsl(210, 15%, 88%)'}
                stroke="hsl(0, 0%, 100%)"
                strokeWidth="1.5"
                className={`transition-all duration-200 ${isActive ? 'cursor-pointer' : ''}`}
                onMouseMove={(e) => handleMouseMove(e, code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => {
                  if (isAdmin && !isActive) addState(code);
                  if (isAdmin && isActive) setEditingState(code);
                }}
              />
            );
          })}
          {/* State labels */}
          {Object.entries(STATE_PATHS).map(([code, path]) => {
            // Calculate center of the path bounding box for label
            const coords = path.match(/\d+/g)?.map(Number) || [];
            if (coords.length < 4) return null;
            const xs = coords.filter((_, i) => i % 2 === 0);
            const ys = coords.filter((_, i) => i % 2 === 1);
            const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
            const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
            return (
              <text
                key={`label-${code}`}
                x={cx}
                y={cy + 2}
                textAnchor="middle"
                className="pointer-events-none select-none"
                fill={activeStateCodes.includes(code) ? 'hsl(215, 30%, 12%)' : 'hsl(215, 15%, 60%)'}
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {code}
              </text>
            );
          })}
        </svg>

        {/* Tooltip on hover */}
        {hoveredData && hoveredData.cities.length > 0 && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: tooltipPos.x + 15,
              top: tooltipPos.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="glass-card rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
              {hoveredData.cities.map((city) => (
                <div key={city.id}>
                  {city.imageUrl && (
                    <div className="w-full h-36 overflow-hidden">
                      <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-display font-bold text-foreground text-sm">{city.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold gradient-accent text-accent-foreground">
                      {hoveredData.stateCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin editor for states */}
      {isAdmin && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-display font-bold text-foreground">Gerenciar Estados e Cidades</h4>
          <p className="text-xs text-muted-foreground">Clique em um estado cinza no mapa para adicioná-lo. Clique em um estado colorido para editá-lo.</p>

          {states.map((state) => (
            <div key={state.id} className="glass-card rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent text-sm">{state.stateCode}</span>
                  <input
                    className="p-1.5 rounded border border-border bg-background text-foreground text-sm"
                    value={state.stateName}
                    onChange={(e) => updateState(state.id, { stateName: e.target.value })}
                    placeholder="Nome do estado"
                  />
                </div>
                <button onClick={() => removeState(state.id)} className="text-destructive text-xs hover:underline flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Remover
                </button>
              </div>

              <div className="pl-4 space-y-2">
                {state.cities.map((city) => (
                  <div key={city.id} className="flex items-start gap-2 bg-muted/30 rounded-lg p-2">
                    <div className="flex-1 space-y-1">
                      <input
                        className="w-full p-1.5 rounded border border-border bg-background text-foreground text-xs"
                        value={city.name}
                        onChange={(e) => updateCity(state.id, city.id, { name: e.target.value })}
                        placeholder="Nome da cidade"
                      />
                      <input
                        className="w-full p-1.5 rounded border border-border bg-background text-foreground text-xs"
                        value={city.imageUrl}
                        onChange={(e) => updateCity(state.id, city.id, { imageUrl: e.target.value })}
                        placeholder="URL da imagem da cidade"
                      />
                    </div>
                    <button onClick={() => removeCity(state.id, city.id)} className="text-destructive p-1 hover:bg-destructive/10 rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addCity(state.id)}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar cidade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrazilMap;
