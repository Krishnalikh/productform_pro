import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  onStepClick = null,
  variant = 'default' // 'default' | 'compact'
}) => {
  const handleStepClick = (stepIndex, step) => {
    if (onStepClick && !step?.disabled && stepIndex <= currentStep) {
      onStepClick(stepIndex, step);
    }
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (stepIndex, step) => {
    const status = getStepStatus(stepIndex);
    const isClickable = onStepClick && !step?.disabled && stepIndex <= currentStep;
    
    let classes = 'flex items-center transition-all duration-200 ';
    
    if (variant === 'compact') {
      classes += 'px-3 py-2 rounded-md ';
    } else {
      classes += 'px-4 py-3 rounded-lg ';
    }
    
    if (isClickable) {
      classes += 'cursor-pointer hover:bg-muted ';
    }
    
    switch (status) {
      case 'completed':
        classes += 'text-success ';
        break;
      case 'current':
        classes += 'text-primary bg-primary/5 ';
        break;
      case 'upcoming':
        classes += 'text-muted-foreground ';
        break;
    }
    
    return classes;
  };

  const getStepIconClasses = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    let classes = 'flex items-center justify-center rounded-full transition-all duration-200 ';
    
    if (variant === 'compact') {
      classes += 'w-6 h-6 text-xs ';
    } else {
      classes += 'w-8 h-8 text-sm ';
    }
    
    switch (status) {
      case 'completed':
        classes += 'bg-success text-success-foreground ';
        break;
      case 'current':
        classes += 'bg-primary text-primary-foreground ';
        break;
      case 'upcoming':
        classes += 'bg-muted text-muted-foreground border border-border ';
        break;
    }
    
    return classes;
  };

  const getConnectorClasses = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    let classes = 'flex-1 h-px transition-all duration-200 ';
    
    if (status === 'completed') {
      classes += 'bg-success ';
    } else {
      classes += 'bg-border ';
    }
    
    return classes;
  };

  if (!steps?.length) return null;

  return (
    <div className="w-full">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => (
            <React.Fragment key={step?.id || index}>
              <div
                className={getStepClasses(index, step)}
                onClick={() => handleStepClick(index, step)}
              >
                <div className="flex items-center space-x-3">
                  <div className={getStepIconClasses(index)}>
                    {getStepStatus(index) === 'completed' ? (
                      <Icon name="Check" size={variant === 'compact' ? 12 : 16} />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-medium ${variant === 'compact' ? 'text-sm' : 'text-base'}`}>
                      {step?.title}
                    </span>
                    {step?.description && variant !== 'compact' && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {step?.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {index < steps?.length - 1 && (
                <div className="flex items-center px-4">
                  <div className={getConnectorClasses(index)} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {steps?.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(((currentStep + 1) / steps?.length) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps?.length) * 100}%` }}
          />
        </div>
        
        <div className="text-center">
          <h3 className="font-medium text-foreground">{steps?.[currentStep]?.title}</h3>
          {steps?.[currentStep]?.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {steps?.[currentStep]?.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;