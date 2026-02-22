import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Analyst {
  id: string;
  name: string;
  role: string;
  area: string;
  photo: string;
  bio: string;
  type?: 'bi' | 'admin';
}

export interface Report {
  id: string;
  name: string;
  creatorId: string;
  description: string;
  images: string[];
  metrics: string[];
}

export interface MapCity {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MapState {
  id: string;
  stateCode: string;
  stateName: string;
  cities: MapCity[];
}

interface SiteContent {
  areaDescription: string;
  faqDescription: string;
  portfolioDescription: string;
  directoryEmail: string;
  analysts: Analyst[];
  reports: Report[];
  aboutUsTitle: string;
  aboutUsText: string;
  analystIntroText: string;
  orgChartUrl: string;
  orgChartTitle: string;
  areaTitle: string;
  portfolioTitle: string;
  faqTitle: string;
  faqSubtitle: string;
  portfolioSubtitle: string;
  biAnalystsTitle: string;
  adminAnalystsTitle: string;
  filterByAnalystTitle: string;
  ourAnalystsTitle: string;
  mapStates: MapState[];
}

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  content: SiteContent;
  updateContent: (content: Partial<SiteContent>) => void;
  addAnalyst: (analyst: Analyst) => void;
  updateAnalyst: (id: string, data: Partial<Analyst>) => void;
  removeAnalyst: (id: string) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
  removeReport: (id: string) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  areaDescription:
    'Nossa área de Business Intelligence atua dentro da Diretoria de Pessoas, sendo responsável por transformar dados em insights estratégicos para a tomada de decisão. A equipe é composta por analistas especializados em diferentes squads, cada um focado em uma vertical do negócio.',
  faqDescription:
    'Bem-vindo ao FAQ dos Relatórios! Aqui você pode explorar as métricas de cada relatório criado pelo nosso time de dados. Selecione um analista para filtrar os relatórios por responsável e clique em qualquer relatório para ver seus detalhes e métricas.',
  portfolioDescription:
    'Conheça todos os relatórios produzidos pela nossa equipe de Business Intelligence. Selecione um analista para filtrar ou navegue por todo o portfólio.',
  directoryEmail: 'diretoria.pessoas@aec.com.br',
  aboutUsTitle: 'O que fazemos',
  aboutUsText:
    '• Governança dos dados provenientes das áreas de Treinamento, Recrutamento, BP e DHO.\n\n• Construção, validação e garantia da assertividade dos indicadores de RH.\n\n• Gestão de todos os relatórios (Orbi) da Diretoria de Pessoas:\n  ✓ 28 relatórios ativos;\n  ✓ 3 relatórios em produção;\n  ✓ 9 relatórios a iniciar.\n\n• Análises e diagnósticos dos números de RH para fornecer informações para tomada de decisão da Diretoria.\n\n• Produção de apresentações executivas.\n\n• Produção de relatórios para as áreas.',
  analystIntroText: 'Conheça abaixo os analistas da nossa área e suas respectivas atribuições.',
  orgChartUrl: '',
  orgChartTitle: 'Organograma da Equipe',
  areaTitle: 'Nossa Área',
  portfolioTitle: 'Relatórios Criados',
  faqTitle: 'FAQ dos Relatórios',
  faqSubtitle: 'Métricas e detalhes dos nossos relatórios',
  portfolioSubtitle: 'AeC - Diretoria de Pessoas - People Analytics',
  biAnalystsTitle: 'Analistas de BI',
  adminAnalystsTitle: 'Analistas Administrativos',
  filterByAnalystTitle: 'Filtrar por Analista',
  ourAnalystsTitle: 'Nossos Analistas',
  mapStates: [
    {
      id: '1',
      stateCode: 'MG',
      stateName: 'Minas Gerais',
      cities: [{ id: '1', name: 'Belo Horizonte', imageUrl: 'https://images.unsplash.com/photo-1611605645802-0cb2e8284d49?w=400&h=300&fit=crop' }],
    },
    {
      id: '2',
      stateCode: 'RN',
      stateName: 'Rio Grande do Norte',
      cities: [{ id: '2', name: 'Natal', imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop' }],
    },
    {
      id: '3',
      stateCode: 'PB',
      stateName: 'Paraíba',
      cities: [{ id: '3', name: 'João Pessoa', imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop' }],
    },
    {
      id: '4',
      stateCode: 'SP',
      stateName: 'São Paulo',
      cities: [{ id: '4', name: 'São Paulo', imageUrl: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=400&h=300&fit=crop' }],
    },
    {
      id: '5',
      stateCode: 'BA',
      stateName: 'Bahia',
      cities: [{ id: '5', name: 'Salvador', imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop' }],
    },
  ],
  analysts: [
    { id: '1', name: 'Allyson Nunes', role: 'Analista de BI', area: 'Treinamento', photo: '', bio: 'Responsável pelos relatórios de treinamento e desenvolvimento de pessoas.', type: 'bi' },
    { id: '2', name: 'Alessa Kettney', role: 'Analista de BI', area: 'Medicina e Business Partner', photo: '', bio: 'Responsável pelos relatórios de medicina ocupacional e atuação como Business Partner.', type: 'bi' },
    { id: '3', name: 'Guilherme Santiago', role: 'Analista de BI', area: 'Recrutamento e Seleção', photo: '', bio: 'Responsável pelos relatórios de recrutamento, seleção e funil admissional.', type: 'bi' },
    { id: '4', name: 'Matheus Wilson', role: 'Analista de BI', area: 'Corporativo', photo: '', bio: 'Responsável pelos relatórios corporativos e indicadores estratégicos.', type: 'bi' },
    { id: '5', name: 'Laura', role: 'Analista Administrativo', area: 'Administrativo', photo: '', bio: 'Analista administrativo da equipe de People Analytics.', type: 'admin' },
    { id: '6', name: 'Henrique', role: 'Analista Administrativo', area: 'Administrativo', photo: '', bio: 'Analista administrativo da equipe de People Analytics.', type: 'admin' },
  ],
  reports: [
    { id: '1', name: 'Gestão Candidato SOU', creatorId: '3', description: 'Funil admissional completo com métricas de inscritos, aprovados e contratados.', images: [], metrics: ['Inscritos Vaga: 10.691', 'Aprovados: 10.428', 'Doc Aprovado: 4.294', 'Assinatura Contrato: 3.566'] },
    { id: '2', name: 'Treinamento Corporativo', creatorId: '1', description: 'Acompanhamento de horas de treinamento e eficácia dos programas.', images: [], metrics: ['Horas Totais: 5.200', 'Participantes: 1.340'] },
    { id: '3', name: 'Indicadores de Saúde', creatorId: '2', description: 'Relatório de medicina ocupacional com indicadores de saúde dos colaboradores.', images: [], metrics: ['Exames Realizados: 3.800', 'Atestados: 420'] },
    { id: '4', name: 'Headcount Corporativo', creatorId: '4', description: 'Análise de headcount e movimentações de pessoal.', images: [], metrics: ['Headcount: 8.500', 'Turnover: 2.3%'] },
  ],
};

const ADMIN_PASSWORD = 'Guisantos88';

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('admin_auth') === 'true');

  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content_v5');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONTENT, ...parsed };
    }
    return DEFAULT_CONTENT;
  });

  const saveContent = useCallback((c: SiteContent) => {
    setContent(c);
    localStorage.setItem('site_content_v5', JSON.stringify(c));
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_auth');
  };

  const updateContent = (partial: Partial<SiteContent>) => saveContent({ ...content, ...partial });

  const addAnalyst = (analyst: Analyst) => saveContent({ ...content, analysts: [...content.analysts, analyst] });
  const updateAnalyst = (id: string, data: Partial<Analyst>) =>
    saveContent({ ...content, analysts: content.analysts.map((a) => (a.id === id ? { ...a, ...data } : a)) });
  const removeAnalyst = (id: string) =>
    saveContent({ ...content, analysts: content.analysts.filter((a) => a.id !== id) });

  const addReport = (report: Report) => saveContent({ ...content, reports: [...content.reports, report] });
  const updateReport = (id: string, data: Partial<Report>) =>
    saveContent({ ...content, reports: content.reports.map((r) => (r.id === id ? { ...r, ...data } : r)) });
  const removeReport = (id: string) =>
    saveContent({ ...content, reports: content.reports.filter((r) => r.id !== id) });

  return (
    <AdminContext.Provider
      value={{ isAdmin, login, logout, content, updateContent, addAnalyst, updateAnalyst, removeAnalyst, addReport, updateReport, removeReport }}
    >
      {children}
    </AdminContext.Provider>
  );
};
