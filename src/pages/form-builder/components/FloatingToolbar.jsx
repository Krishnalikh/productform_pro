import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloatingToolbar = ({ 
  formData, 
  onSave, 
  onPreview, 
  onPublish, 
  onUndo, 
  onRedo,
  canUndo = false,
  canRedo = false,
  isSaving = false,
  lastSaved = null
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return 'Never saved';
    
    const now = new Date();
    const saved = new Date(timestamp);
    const diffInMinutes = Math.floor((now - saved) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just saved';
    if (diffInMinutes < 60) return `Saved ${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Saved ${diffInHours}h ago`;
    
    return saved?.toLocaleDateString();
  };

  const moreActions = [
    { key: 'export', label: 'Export Form', icon: 'Download', onClick: () => console.log('Export') },
    { key: 'import', label: 'Import Form', icon: 'Upload', onClick: () => console.log('Import') },
    { key: 'duplicate', label: 'Duplicate Form', icon: 'Copy', onClick: () => console.log('Duplicate') },
    { key: 'settings', label: 'Form Settings', icon: 'Settings', onClick: () => console.log('Settings') }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center bg-card border border-border rounded-lg shadow-lg px-4 py-3 space-x-3">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            iconName="Undo"
            iconSize={16}
            className="w-8 h-8"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            iconName="Redo"
            iconSize={16}
            className="w-8 h-8"
          />
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Save Status */}
        <div className="flex items-center space-x-2">
          {isSaving ? (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {formatLastSaved(lastSaved)}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Primary Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            Save Draft
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
          >
            Preview
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onPublish}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
          >
            Publish
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* More Actions */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreActions(!showMoreActions)}
            iconName="MoreHorizontal"
            iconSize={16}
            className="w-8 h-8"
          />

          {showMoreActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMoreActions(false)}
              />
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
                <div className="py-1">
                  {moreActions?.map((action) => (
                    <button
                      key={action?.key}
                      onClick={() => {
                        action?.onClick();
                        setShowMoreActions(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon name={action?.icon} size={16} className="mr-3" />
                      {action?.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Form Status Indicator */}
      <div className="flex items-center justify-center mt-2">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-card border border-border rounded-full px-3 py-1">
          <div className={`w-2 h-2 rounded-full ${
            formData?.status === 'published' ? 'bg-success' :
            formData?.status === 'draft' ? 'bg-warning' : 'bg-muted-foreground'
          }`} />
          <span className="capitalize">{formData?.status || 'draft'}</span>
          {formData?.totalQuestions > 0 && (
            <>
              <span>•</span>
              <span>{formData?.totalQuestions} questions</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingToolbar;