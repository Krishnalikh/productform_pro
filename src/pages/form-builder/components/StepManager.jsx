import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StepManager = ({ steps, currentStep, onStepChange, onUpdateStep, onAddStep, onDeleteStep }) => {
  const [editingStep, setEditingStep] = useState(null);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');

  const handleAddStep = () => {
    if (newStepTitle?.trim()) {
      onAddStep({
        title: newStepTitle?.trim(),
        description: newStepDescription?.trim(),
        questions: []
      });
      setNewStepTitle('');
      setNewStepDescription('');
      setShowAddStep(false);
    }
  };

  const handleUpdateStep = (stepIndex, updates) => {
    onUpdateStep(stepIndex, updates);
    setEditingStep(null);
  };

  const handleDeleteStep = (stepIndex) => {
    if (steps?.length > 1 && window.confirm('Are you sure you want to delete this step? All questions in this step will be lost.')) {
      onDeleteStep(stepIndex);
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Form Steps</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddStep(true)}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Add Step
          </Button>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {steps?.map((step, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                currentStep === index
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => onStepChange(index)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingStep === index ? (
                    <div className="space-y-2" onClick={(e) => e?.stopPropagation()}>
                      <Input
                        type="text"
                        value={step?.title}
                        onChange={(e) => handleUpdateStep(index, { ...step, title: e?.target?.value })}
                        placeholder="Step title"
                        className="text-sm"
                      />
                      <Input
                        type="text"
                        value={step?.description || ''}
                        onChange={(e) => handleUpdateStep(index, { ...step, description: e?.target?.value })}
                        placeholder="Step description (optional)"
                        className="text-xs"
                      />
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setEditingStep(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="xs"
                          onClick={() => setEditingStep(null)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium text-foreground truncate">
                        {step?.title || `Step ${index + 1}`}
                      </h4>
                      {step?.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {step?.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>{step?.questions?.length} questions</span>
                        {step?.conditionalLogic && (
                          <span className="flex items-center space-x-1">
                            <Icon name="GitBranch" size={12} />
                            <span>Has logic</span>
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {editingStep !== index && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e?.stopPropagation();
                      setEditingStep(index);
                    }}
                    className="w-6 h-6"
                  >
                    <Icon name="Edit2" size={12} />
                  </Button>
                  {steps?.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleDeleteStep(index);
                      }}
                      className="w-6 h-6 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={12} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Step Form */}
        {showAddStep && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20">
            <h4 className="font-medium text-foreground mb-3">Add New Step</h4>
            <div className="space-y-3">
              <Input
                label="Step Title"
                type="text"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e?.target?.value)}
                placeholder="Enter step title"
                required
              />
              <Input
                label="Description"
                type="text"
                value={newStepDescription}
                onChange={(e) => setNewStepDescription(e?.target?.value)}
                placeholder="Optional step description"
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddStep(false);
                    setNewStepTitle('');
                    setNewStepDescription('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddStep}
                  disabled={!newStepTitle?.trim()}
                >
                  Add Step
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepManager;