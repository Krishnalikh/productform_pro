import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const StatusNotification = ({
  notifications = [],
  onDismiss = () => {},
  onDismissAll = () => {},
  position = 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
  maxVisible = 5,
  autoHideDuration = 5000
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications?.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  useEffect(() => {
    const timers = [];
    
    visibleNotifications?.forEach((notification) => {
      if (notification?.autoHide !== false && autoHideDuration > 0) {
        const timer = setTimeout(() => {
          handleDismiss(notification?.id);
        }, autoHideDuration);
        timers?.push(timer);
      }
    });

    return () => {
      timers?.forEach(timer => clearTimeout(timer));
    };
  }, [visibleNotifications, autoHideDuration]);

  const handleDismiss = (id) => {
    setVisibleNotifications(prev => prev?.filter(n => n?.id !== id));
    onDismiss(id);
  };

  const handleDismissAll = () => {
    setVisibleNotifications([]);
    onDismissAll();
  };

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50 flex flex-col gap-2 p-4 pointer-events-none';
    
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'top-center':
        return `${baseClasses} top-0 left-1/2 -translate-x-1/2`;
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      default:
        return `${baseClasses} top-0 right-0`;
    }
  };

  const getNotificationClasses = (type) => {
    let classes = 'flex items-start gap-3 p-4 rounded-lg shadow-lg border pointer-events-auto transition-all duration-300 max-w-sm ';
    
    switch (type) {
      case 'success':
        classes += 'bg-card border-success/20 text-foreground ';
        break;
      case 'error':
        classes += 'bg-card border-error/20 text-foreground ';
        break;
      case 'warning':
        classes += 'bg-card border-warning/20 text-foreground ';
        break;
      case 'info':
        classes += 'bg-card border-primary/20 text-foreground ';
        break;
      default:
        classes += 'bg-card border-border text-foreground ';
    }
    
    return classes;
  };

  const getIconName = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!visibleNotifications?.length) return null;

  return (
    <div className={getPositionClasses()}>
      {/* Dismiss All Button */}
      {visibleNotifications?.length > 1 && (
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={handleDismissAll}
            className="text-xs text-muted-foreground hover:text-foreground pointer-events-auto"
          >
            Dismiss All
          </Button>
        </div>
      )}
      {/* Notifications */}
      {visibleNotifications?.map((notification) => (
        <div
          key={notification?.id}
          className={getNotificationClasses(notification?.type)}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <Icon
              name={getIconName(notification?.type)}
              size={20}
              className={getIconColor(notification?.type)}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {notification?.title && (
              <h4 className="text-sm font-medium text-foreground mb-1">
                {notification?.title}
              </h4>
            )}
            <p className="text-sm text-muted-foreground">
              {notification?.message}
            </p>
            {notification?.action && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={notification?.action?.onClick}
                  className="text-xs"
                >
                  {notification?.action?.label}
                </Button>
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDismiss(notification?.id)}
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      ))}
      {/* Overflow Indicator */}
      {notifications?.length > maxVisible && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="xs"
            className="text-xs text-muted-foreground pointer-events-auto"
          >
            +{notifications?.length - maxVisible} more notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default StatusNotification;