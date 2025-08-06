import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationProgress = ({ isVisible, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(45);
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const steps = [
    {
      id: 'validate',
      title: 'Validating Data Sources',
      description: 'Checking form submissions and data integrity',
      duration: 8
    },
    {
      id: 'process',
      title: 'Processing Data',
      description: 'Applying filters and organizing information',
      duration: 15
    },
    {
      id: 'generate',
      title: 'Generating Report',
      description: 'Creating PDF with selected template and data',
      duration: 18
    },
    {
      id: 'finalize',
      title: 'Finalizing Report',
      description: 'Adding formatting and preparing for download',
      duration: 4
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      // Reset state when modal closes
      setCurrentStep(0);
      setProgress(0);
      setEstimatedTime(45);
      setIsCompleted(false);
      setDownloadUrl(null);
      return;
    }

    const totalDuration = steps?.reduce((sum, step) => sum + step?.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 1;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      setEstimatedTime(Math.max(totalDuration - elapsed, 0));

      // Update current step
      let stepProgress = 0;
      let newCurrentStep = 0;
      for (let i = 0; i < steps?.length; i++) {
        stepProgress += steps?.[i]?.duration;
        if (elapsed < stepProgress) {
          newCurrentStep = i;
          break;
        }
        newCurrentStep = i + 1;
      }
      setCurrentStep(newCurrentStep);

      // Complete the process
      if (elapsed >= totalDuration) {
        setIsCompleted(true);
        setDownloadUrl('/mock-report.pdf');
        clearInterval(interval);
        if (onComplete) {
          onComplete({
            id: `rpt-${Date.now()}`,
            name: 'Generated Report',
            downloadUrl: '/mock-report.pdf'
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  const handleDownload = () => {
    console.log('Downloading report from:', downloadUrl);
    // Simulate download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'report.pdf';
    link?.click();
  };

  const handleEmailReport = () => {
    console.log('Emailing report');
    // Simulate email functionality
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {isCompleted ? 'Report Generated' : 'Generating Report'}
            </h2>
            {isCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isCompleted ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Loader2" size={16} className="text-primary-foreground animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {steps?.[currentStep]?.title || 'Processing...'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {steps?.[currentStep]?.description || 'Please wait...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3 mb-6">
                {steps?.map((step, index) => (
                  <div key={step?.id} className="flex items-center space-x-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                      ${index < currentStep 
                        ? 'bg-success text-success-foreground' 
                        : index === currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {index < currentStep ? (
                        <Icon name="Check" size={12} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-sm ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Estimated Time */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Estimated time remaining: <span className="font-medium">{estimatedTime}s</span>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Report Generated Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  Your report has been generated and is ready for download.
                </p>
              </div>

              {/* Report Info */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium text-foreground">2.4 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium text-foreground">PDF</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Pages:</span>
                  <span className="font-medium text-foreground">12</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="default"
                  fullWidth
                  onClick={handleDownload}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Download Report
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleEmailReport}
                  iconName="Mail"
                  iconPosition="left"
                  iconSize={16}
                >
                  Email Report
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isCompleted && (
          <div className="p-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Please don't close this window while the report is being generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationProgress;