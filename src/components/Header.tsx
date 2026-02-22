import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, Mail } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'area', label: 'Nossa Área' },
  { id: 'portfolio', label: 'Relatórios Criados' },
  { id: 'faq', label: 'FAQ dos Relatórios' },
];

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { isAdmin, login, logout, content, updateContent } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    if (login(password)) {
      setOpen(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 gradient-navy galaxy-bg border-b border-navy-light/50">
      <div className="relative z-10 w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-lg">BI</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-primary-foreground text-lg leading-tight">
                Diretoria de Pessoas
              </h1>
              <p className="text-primary-foreground/60 text-xs">Business Intelligence</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1 bg-navy-light/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/50 hover:text-primary-foreground/80'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 gradient-accent rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile nav */}
          <nav className="flex md:hidden items-center gap-1 bg-navy-light/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-bg-mobile"
                    className="absolute inset-0 gradient-accent rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Email da Diretoria */}
            <div className="hidden lg:flex items-center gap-1.5 text-primary-foreground/40 text-xs">
              <Mail className="w-3.5 h-3.5" />
              {isAdmin ? (
                <input
                  className="bg-transparent border-b border-primary-foreground/20 text-primary-foreground/60 text-xs w-48 outline-none focus:border-accent"
                  value={content.directoryEmail}
                  onChange={(e) => updateContent({ directoryEmail: e.target.value })}
                />
              ) : (
                <a href={`mailto:${content.directoryEmail}`} className="hover:text-accent transition-colors">
                  {content.directoryEmail}
                </a>
              )}
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-accent font-medium">Admin</span>
                <Button variant="ghost" size="icon" onClick={logout} className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-navy-light">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-foreground/40 hover:text-primary-foreground hover:bg-navy-light">
                    <Shield className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle className="font-display">Acesso Administrativo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Input
                      type="password"
                      placeholder="Digite a senha"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(false); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className={error ? 'border-destructive' : ''}
                    />
                    {error && <p className="text-destructive text-sm">Senha incorreta</p>}
                    <Button onClick={handleLogin} className="w-full gradient-accent text-primary-foreground border-0">Entrar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Email on mobile */}
        <div className="flex lg:hidden items-center justify-center gap-1.5 text-primary-foreground/40 text-xs mt-2">
          <Mail className="w-3 h-3" />
          <a href={`mailto:${content.directoryEmail}`} className="hover:text-accent transition-colors">
            {content.directoryEmail}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
