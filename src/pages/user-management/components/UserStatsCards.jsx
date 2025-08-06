import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStatsCards = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      title: 'Total Users',
      value: stats?.total || 0,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats?.totalChange || 0,
      changeType: stats?.totalChange >= 0 ? 'increase' : 'decrease'
    },
    {
      id: 'active',
      title: 'Active Users',
      value: stats?.active || 0,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: stats?.activeChange || 0,
      changeType: stats?.activeChange >= 0 ? 'increase' : 'decrease'
    },
    {
      id: 'pending',
      title: 'Pending Invitations',
      value: stats?.pending || 0,
      icon: 'UserPlus',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.pendingChange || 0,
      changeType: stats?.pendingChange >= 0 ? 'increase' : 'decrease'
    },
    {
      id: 'inactive',
      title: 'Inactive Users',
      value: stats?.inactive || 0,
      icon: 'UserX',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: stats?.inactiveChange || 0,
      changeType: stats?.inactiveChange >= 0 ? 'increase' : 'decrease'
    }
  ];

  const formatChange = (change, changeType) => {
    if (change === 0) return null;
    
    return (
      <div className={`flex items-center space-x-1 text-xs ${
        changeType === 'increase' ? 'text-success' : 'text-error'
      }`}>
        <Icon 
          name={changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
          size={12} 
        />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards?.map((card) => (
        <div key={card?.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {card?.title}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-foreground">
                  {card?.value?.toLocaleString()}
                </p>
                {formatChange(card?.change, card?.changeType)}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card?.bgColor}`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStatsCards;