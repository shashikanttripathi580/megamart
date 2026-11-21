import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: 'search' | 'cart' | 'error' | 'generic';
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'generic',
  title,
  description,
  actionLabel,
  actionHref = '/products',
  onActionClick,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <Search className="w-12 h-12 text-slate-400 stroke-[1.5]" />;
      case 'cart':
        return <ShoppingBag className="w-12 h-12 text-emerald-600 stroke-[1.5]" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-rose-500 stroke-[1.5]" />;
      default:
        return <ShoppingBag className="w-12 h-12 text-slate-400 stroke-[1.5]" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-6 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        onActionClick ? (
          <Button onClick={onActionClick} className="bg-emerald-600 hover:bg-emerald-700">
            {actionLabel}
          </Button>
        ) : (
          <Link to={actionHref}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              {actionLabel} <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        )
      )}
    </div>
  );
};
