import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickStartPanel = ({ recentTemplates = [], upcomingDeadlines = [] }) => {
  const navigate = useNavigate();

  const handleCreateForm = () => {
    navigate('/form-builder');
  };

  const handleUseTemplate = (templateId) => {
    navigate(`/form-builder?template=${templateId}`);
  };

  const formatDeadlineDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date?.getTime() - now?.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDeadlineUrgency = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date?.getTime() - now?.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      {/* Create New Form Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Plus" size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Create New Form</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Start building a new product data collection form with our intuitive form builder.
          </p>
          <Button
            variant="default"
            onClick={handleCreateForm}
            iconName="Plus"
            iconPosition="left"
            className="w-full"
          >
            Create Form
          </Button>
        </div>
      </div>
      {/* Recent Templates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Templates</h3>
          <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </div>
        
        {recentTemplates?.length > 0 ? (
          <div className="space-y-3">
            {recentTemplates?.slice(0, 3)?.map((template) => (
              <div
                key={template?.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleUseTemplate(template?.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileTemplate" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{template?.name}</p>
                    <p className="text-xs text-muted-foreground">{template?.category}</p>
                  </div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icon name="FileTemplate" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No templates available</p>
          </div>
        )}
      </div>
      {/* Upcoming Deadlines */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
          <Button variant="ghost" size="sm" iconName="Calendar" iconPosition="left">
            Calendar
          </Button>
        </div>
        
        {upcomingDeadlines?.length > 0 ? (
          <div className="space-y-3">
            {upcomingDeadlines?.slice(0, 4)?.map((deadline) => {
              const urgency = getDeadlineUrgency(deadline?.dueDate);
              const urgencyColors = {
                urgent: 'border-l-error bg-error/5',
                warning: 'border-l-warning bg-warning/5',
                normal: 'border-l-primary bg-primary/5'
              };
              
              return (
                <div
                  key={deadline?.id}
                  className={`p-3 border-l-4 rounded-r-lg ${urgencyColors?.[urgency]}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{deadline?.formName}</p>
                      <p className="text-xs text-muted-foreground">{deadline?.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-foreground">
                        {formatDeadlineDate(deadline?.dueDate)}
                      </p>
                      <p className="text-xs text-muted-foreground">{deadline?.assignee}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icon name="Calendar" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStartPanel;