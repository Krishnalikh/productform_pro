import React from 'react';
import Icon from '../../../components/AppIcon';

const SubmissionMetrics = ({ metrics = {} }) => {
  const defaultMetrics = {
    totalSubmissions: 1247,
    completedSubmissions: 1089,
    pendingReview: 158,
    completionRate: 87.3,
    averageCompletionTime: '12.5 min',
    todaySubmissions: 23
  };

  const data = { ...defaultMetrics, ...metrics };

  const metricCards = [
    {
      title: 'Total Submissions',
      value: data?.totalSubmissions?.toLocaleString(),
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed',
      value: data?.completedSubmissions?.toLocaleString(),
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pending Review',
      value: data?.pendingReview?.toLocaleString(),
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Completion Rate',
      value: `${data?.completionRate}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Avg. Time',
      value: data?.averageCompletionTime,
      icon: 'Timer',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Today',
      value: data?.todaySubmissions?.toLocaleString(),
      icon: 'Calendar',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={20} className={metric?.color} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionMetrics;