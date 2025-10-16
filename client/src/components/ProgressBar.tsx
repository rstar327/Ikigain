import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useTranslation(['test']);
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          {t('test:progress.question', { current, total })}
        </span>
        <span className="text-sm text-gray-600">
          {t('test:progress.completed', { percentage })}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
