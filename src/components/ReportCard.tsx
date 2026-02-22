import { motion } from 'framer-motion';
import { FileText, User } from 'lucide-react';
import { Report } from '@/contexts/AdminContext';

interface ReportCardProps {
  report: Report;
  creatorName: string;
  index: number;
  onClick: () => void;
}

const ReportCard = ({ report, creatorName, index, onClick }: ReportCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04 }}
      onClick={onClick}
      className="glass-card rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {report.images[0] ? (
          <img src={report.images[0]} alt={report.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-display font-semibold text-foreground truncate">{report.name}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-accent">
          <User className="w-3 h-3" />
          <span>{creatorName}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;
