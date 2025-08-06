import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ActionToolbar = ({
  selectedItems = [],
  availableActions = [],
  onAction = () => {},
  userPermissions = [],
  className = '',
  variant = 'default' // 'default' | 'floating' | 'compact'
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const hasPermission = (action) => {
    if (!action?.permission) return true;
    return userPermissions?.includes(action?.permission) || userPermissions?.includes('admin');
  };

  const isActionDisabled = (action) => {
    if (action?.disabled) return true;
    if (action?.requiresSelection && selectedItems?.length === 0) return true;
    if (action?.maxSelection && selectedItems?.length > action?.maxSelection) return true;
    if (action?.minSelection && selectedItems?.length < action?.minSelection) return true;
    return false;
  };

  const visibleActions = availableActions?.filter(action => 
    hasPermission(action) && (action?.primary || availableActions?.indexOf(action) < 3)
  );

  const moreActions = availableActions?.filter(action => 
    hasPermission(action) && !action?.primary && availableActions?.indexOf(action) >= 3
  );

  const handleAction = (action) => {
    if (!isActionDisabled(action)) {
      onAction(action?.key, selectedItems, action);
      setShowMoreActions(false);
    }
  };

  const getToolbarClasses = () => {
    let classes = 'flex items-center gap-2 ';
    
    switch (variant) {
      case 'floating':
        classes += 'bg-card border border-border rounded-lg shadow-lg px-4 py-2 ';
        break;
      case 'compact':
        classes += 'bg-muted/50 rounded-md px-3 py-1.5 ';
        break;
      default:
        classes += 'bg-background border-b border-border px-4 py-3 ';
    }
    
    return classes + className;
  };

  const getButtonSize = () => {
    return variant === 'compact' ? 'xs' : 'sm';
  };

  if (!availableActions?.length) return null;

  return (
    <div className={getToolbarClasses()}>
      {/* Selection Info */}
      {selectedItems?.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground mr-4">
          <Icon name="CheckSquare" size={16} className="mr-2" />
          <span>
            {selectedItems?.length} item{selectedItems?.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        {visibleActions?.map((action) => (
          <Button
            key={action?.key}
            variant={action?.variant || 'outline'}
            size={getButtonSize()}
            onClick={() => handleAction(action)}
            disabled={isActionDisabled(action)}
            iconName={action?.icon}
            iconPosition="left"
            iconSize={16}
            className={action?.className}
          >
            {action?.label}
          </Button>
        ))}

        {/* More Actions Dropdown */}
        {moreActions?.length > 0 && (
          <div className="relative">
            <Button
              variant="outline"
              size={getButtonSize()}
              onClick={() => setShowMoreActions(!showMoreActions)}
              iconName="MoreHorizontal"
              iconSize={16}
            >
              More
            </Button>

            {showMoreActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreActions(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
                  <div className="py-1">
                    {moreActions?.map((action) => (
                      <button
                        key={action?.key}
                        onClick={() => handleAction(action)}
                        disabled={isActionDisabled(action)}
                        className={`
                          w-full flex items-center px-4 py-2 text-sm text-left
                          transition-colors duration-200
                          ${isActionDisabled(action) 
                            ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                            : 'text-foreground hover:bg-muted cursor-pointer'
                          }
                          ${action?.destructive ? 'text-error hover:bg-error/10' : ''}
                        `}
                      >
                        {action?.icon && (
                          <Icon name={action?.icon} size={16} className="mr-3" />
                        )}
                        {action?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Quick Filters (if provided) */}
      {availableActions?.some(action => action?.type === 'filter') && (
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-px h-6 bg-border mx-2" />
          {availableActions?.filter(action => action?.type === 'filter' && hasPermission(action))?.map((filter) => (
              <Button
                key={filter?.key}
                variant={filter?.active ? 'default' : 'ghost'}
                size={getButtonSize()}
                onClick={() => handleAction(filter)}
                iconName={filter?.icon}
                iconSize={14}
              >
                {filter?.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
};

export default ActionToolbar;