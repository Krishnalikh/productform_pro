import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusNotification from '../../components/ui/StatusNotification';
import QuestionBank from './components/QuestionBank';
import FormWorkspace from './components/FormWorkspace';
import PropertiesPanel from './components/PropertiesPanel';
import FloatingToolbar from './components/FloatingToolbar';
import StepManager from './components/StepManager';

const FormBuilder = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showStepManager, setShowStepManager] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Mock form data
  const [formData, setFormData] = useState({
    id: 'form_001',
    title: 'Product Information Form',
    description: 'Comprehensive product data collection form with conditional logic',
    status: 'draft',
    totalQuestions: 0,
    createdAt: '2025-01-06T10:30:00Z',
    updatedAt: '2025-01-06T14:15:00Z'
  });

  const [formSteps, setFormSteps] = useState([
    {
      id: 'step_1',
      title: 'Basic Information',
      description: 'Product name, category, and basic details',
      questions: [
        {
          id: 'q1',
          type: 'text',
          name: 'product_name',
          label: 'Product Name',
          placeholder: 'Enter product name',
          icon: 'Tag',
          validation: { required: true },
          width: 'full'
        },
        {
          id: 'q2',
          type: 'select',
          name: 'product_category',
          label: 'Product Category',
          placeholder: 'Select category',
          icon: 'Folder',
          options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'home', label: 'Home & Garden' },
            { value: 'books', label: 'Books' }
          ],
          validation: { required: true },
          width: 'half'
        }
      ]
    },
    {
      id: 'step_2',
      title: 'Pricing & Specifications',
      description: 'Product pricing, specifications, and technical details',
      questions: [
        {
          id: 'q3',
          type: 'number',
          name: 'price',
          label: 'Product Price ($)',
          placeholder: '0.00',
          icon: 'DollarSign',
          validation: { required: true, min: 0 },
          width: 'half'
        }
      ]
    },
    {
      id: 'step_3',
      title: 'Media & Documentation',
      description: 'Product images, documents, and additional media',
      questions: []
    }
  ]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Home' },
    { label: 'Form Builder', href: '/form-builder' }
  ];

  useEffect(() => {
    const totalQuestions = formSteps?.reduce((total, step) => total + step?.questions?.length, 0);
    setFormData(prev => ({ ...prev, totalQuestions }));
  }, [formSteps]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleAddQuestion = (questionTemplate) => {
    const newQuestion = {
      ...questionTemplate,
      id: `q_${Date.now()}`,
      name: `field_${Date.now()}`,
      label: questionTemplate?.name,
      validation: {},
      width: 'full'
    };

    const updatedSteps = [...formSteps];
    updatedSteps?.[currentStep]?.questions?.push(newQuestion);
    setFormSteps(updatedSteps);

    addNotification({
      type: 'success',
      title: 'Question Added',
      message: `${questionTemplate?.name} has been added to the form`
    });
  };

  const handleDropQuestion = (questionTemplate, stepIndex) => {
    const newQuestion = {
      ...questionTemplate,
      id: `q_${Date.now()}`,
      name: `field_${Date.now()}`,
      label: questionTemplate?.name,
      validation: {},
      width: 'full'
    };

    const updatedSteps = [...formSteps];
    updatedSteps?.[stepIndex]?.questions?.push(newQuestion);
    setFormSteps(updatedSteps);

    addNotification({
      type: 'success',
      title: 'Question Added',
      message: `${questionTemplate?.name} has been added to step ${stepIndex + 1}`
    });
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    const updatedSteps = formSteps?.map(step => ({
      ...step,
      questions: step?.questions?.map(q => 
        q?.id === updatedQuestion?.id ? updatedQuestion : q
      )
    }));
    setFormSteps(updatedSteps);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedSteps = formSteps?.map(step => ({
      ...step,
      questions: step?.questions?.filter(q => q?.id !== questionId)
    }));
    setFormSteps(updatedSteps);
    setSelectedQuestion(null);

    addNotification({
      type: 'info',
      title: 'Question Deleted',
      message: 'The question has been removed from the form'
    });
  };

  const handleDuplicateQuestion = (question) => {
    const duplicatedQuestion = {
      ...question,
      id: `q_${Date.now()}`,
      name: `${question?.name}_copy`,
      label: `${question?.label} (Copy)`
    };

    const updatedSteps = [...formSteps];
    const stepIndex = updatedSteps?.findIndex(step => 
      step?.questions?.some(q => q?.id === question?.id)
    );
    
    if (stepIndex !== -1) {
      const questionIndex = updatedSteps?.[stepIndex]?.questions?.findIndex(q => q?.id === question?.id);
      updatedSteps?.[stepIndex]?.questions?.splice(questionIndex + 1, 0, duplicatedQuestion);
      setFormSteps(updatedSteps);
    }
  };

  const handleAddStep = (stepData) => {
    const newStep = {
      id: `step_${Date.now()}`,
      ...stepData
    };
    setFormSteps(prev => [...prev, newStep]);
    setCurrentStep(formSteps?.length);
  };

  const handleUpdateStep = (stepIndex, updates) => {
    const updatedSteps = [...formSteps];
    updatedSteps[stepIndex] = { ...updatedSteps?.[stepIndex], ...updates };
    setFormSteps(updatedSteps);
  };

  const handleDeleteStep = (stepIndex) => {
    if (formSteps?.length > 1) {
      const updatedSteps = formSteps?.filter((_, index) => index !== stepIndex);
      setFormSteps(updatedSteps);
      setCurrentStep(Math.min(currentStep, updatedSteps?.length - 1));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLastSaved(new Date());
    setIsSaving(false);
    
    addNotification({
      type: 'success',
      title: 'Form Saved',
      message: 'Your form has been saved as draft'
    });
  };

  const handlePreview = () => {
    addNotification({
      type: 'info',
      title: 'Preview Mode',
      message: 'Opening form preview in new tab'
    });
  };

  const handlePublish = () => {
    if (formData?.totalQuestions === 0) {
      addNotification({
        type: 'warning',
        title: 'Cannot Publish',
        message: 'Add at least one question before publishing'
      });
      return;
    }

    setFormData(prev => ({ ...prev, status: 'published' }));
    addNotification({
      type: 'success',
      title: 'Form Published',
      message: 'Your form is now live and accepting responses'
    });
  };

  const handleUndo = () => {
    // Implement undo logic
    console.log('Undo action');
  };

  const handleRedo = () => {
    // Implement redo logic
    console.log('Redo action');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Form Builder</h1>
              <p className="text-muted-foreground">
                Create and configure multi-step forms with conditional logic
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStepManager(!showStepManager)}
                className="lg:hidden px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted transition-colors"
              >
                Manage Steps
              </button>
            </div>
          </div>

          {/* Step Manager (Mobile) */}
          {showStepManager && (
            <div className="lg:hidden mb-6">
              <StepManager
                steps={formSteps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onUpdateStep={handleUpdateStep}
                onAddStep={handleAddStep}
                onDeleteStep={handleDeleteStep}
              />
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Question Bank - Left Panel */}
            <div className="lg:col-span-3 h-full">
              <QuestionBank
                onAddQuestion={handleAddQuestion}
                onDragStart={(question) => console.log('Drag started:', question)}
              />
            </div>

            {/* Form Workspace - Center Panel */}
            <div className="lg:col-span-6 h-full">
              <FormWorkspace
                formSteps={formSteps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onDropQuestion={handleDropQuestion}
                onSelectQuestion={setSelectedQuestion}
                selectedQuestion={selectedQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onDuplicateQuestion={handleDuplicateQuestion}
              />
            </div>

            {/* Properties Panel - Right Panel */}
            <div className="lg:col-span-3 h-full">
              <PropertiesPanel
                selectedQuestion={selectedQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onClose={() => setSelectedQuestion(null)}
              />
            </div>
          </div>

          {/* Step Manager (Desktop) */}
          <div className="hidden lg:block mt-6">
            <StepManager
              steps={formSteps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onUpdateStep={handleUpdateStep}
              onAddStep={handleAddStep}
              onDeleteStep={handleDeleteStep}
            />
          </div>
        </div>
      </main>
      {/* Floating Toolbar */}
      <FloatingToolbar
        formData={formData}
        onSave={handleSave}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack?.length > 0}
        canRedo={redoStack?.length > 0}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
      {/* Status Notifications */}
      <StatusNotification
        notifications={notifications}
        onDismiss={(id) => setNotifications(prev => prev?.filter(n => n?.id !== id))}
        onDismissAll={() => setNotifications([])}
        position="top-right"
        maxVisible={3}
        autoHideDuration={5000}
      />
    </div>
  );
};

export default FormBuilder;