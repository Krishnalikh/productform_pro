import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProgressIndicator from '../../../components/ui/ProgressIndicator';

const FormWorkspace = ({ 
  formSteps, 
  currentStep, 
  onStepChange, 
  onDropQuestion, 
  onSelectQuestion, 
  selectedQuestion,
  onDeleteQuestion,
  onDuplicateQuestion 
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    
    try {
      const questionData = JSON.parse(e?.dataTransfer?.getData('application/json'));
      onDropQuestion(questionData, currentStep);
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const renderQuestionPreview = (question, index) => {
    const isSelected = selectedQuestion?.id === question?.id;
    
    return (
      <div
        key={question?.id}
        onClick={() => onSelectQuestion(question)}
        className={`group relative p-4 border rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'border-primary bg-primary/5 shadow-sm' 
            : 'border-border hover:border-primary/50 hover:shadow-sm'
        }`}
      >
        {/* Question Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                onDuplicateQuestion(question);
              }}
              className="w-6 h-6"
            >
              <Icon name="Copy" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                onDeleteQuestion(question?.id);
              }}
              className="w-6 h-6 text-error hover:text-error"
            >
              <Icon name="Trash2" size={12} />
            </Button>
          </div>
        </div>
        {/* Question Content */}
        <div className="pr-16">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={question?.icon} size={16} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {question?.type}
            </span>
          </div>
          
          <h4 className="text-sm font-medium text-foreground mb-1">
            {question?.label || question?.name}
          </h4>
          
          {question?.description && (
            <p className="text-xs text-muted-foreground mb-3">{question?.description}</p>
          )}

          {/* Question Preview */}
          <div className="space-y-2">
            {question?.type === 'text' && (
              <input
                type="text"
                placeholder={question?.placeholder || 'Enter text...'}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                disabled
              />
            )}
            
            {question?.type === 'textarea' && (
              <textarea
                placeholder={question?.placeholder || 'Enter text...'}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                disabled
              />
            )}
            
            {question?.type === 'select' && (
              <select className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" disabled>
                <option>{question?.placeholder || 'Select an option...'}</option>
                {question?.options?.map((option, idx) => (
                  <option key={idx} value={option?.value}>{option?.label}</option>
                ))}
              </select>
            )}
            
            {question?.type === 'radio' && (
              <div className="space-y-2">
                {(question?.options || [{ label: 'Option 1' }, { label: 'Option 2' }])?.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-2 text-sm">
                    <input type="radio" name={`preview-${question?.id}`} disabled className="text-primary" />
                    <span>{option?.label}</span>
                  </label>
                ))}
              </div>
            )}
            
            {question?.type === 'checkbox' && (
              <div className="space-y-2">
                {(question?.options || [{ label: 'Option 1' }, { label: 'Option 2' }])?.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" disabled className="text-primary" />
                    <span>{option?.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Conditional Logic Indicator */}
          {question?.conditionalLogic && (
            <div className="mt-3 flex items-center space-x-2 text-xs text-primary">
              <Icon name="GitBranch" size={12} />
              <span>Has conditional logic</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentStepData = formSteps?.[currentStep] || { questions: [] };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Step Navigation */}
      <div className="p-4 border-b border-border bg-card">
        <ProgressIndicator
          steps={formSteps?.map((step, index) => ({
            id: index,
            title: step?.title,
            description: `${step?.questions?.length} questions`
          }))}
          currentStep={currentStep}
          onStepClick={(stepIndex) => onStepChange(stepIndex)}
          variant="compact"
        />
      </div>
      {/* Form Preview */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Step Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {currentStepData?.title || `Step ${currentStep + 1}`}
            </h2>
            {currentStepData?.description && (
              <p className="text-muted-foreground">{currentStepData?.description}</p>
            )}
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[400px] border-2 border-dashed rounded-lg transition-all ${
              dragOver 
                ? 'border-primary bg-primary/5' :'border-border'
            }`}
          >
            {currentStepData?.questions?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Icon name="MousePointer" size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {dragOver ? 'Drop question here' : 'No questions added yet'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {dragOver 
                    ? 'Release to add this question to your form'
                    : 'Drag questions from the question bank or click the + button to add questions to this step'
                  }
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {currentStepData?.questions?.map((question, index) => 
                  renderQuestionPreview(question, index)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Step Actions */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStepChange(Math.min(formSteps?.length - 1, currentStep + 1))}
              disabled={currentStep === formSteps?.length - 1}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {currentStepData?.questions?.length} question{currentStepData?.questions?.length !== 1 ? 's' : ''} in this step
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormWorkspace;