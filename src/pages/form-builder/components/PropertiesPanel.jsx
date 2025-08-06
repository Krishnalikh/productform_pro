import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PropertiesPanel = ({ selectedQuestion, onUpdateQuestion, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');

  if (!selectedQuestion) {
    return (
      <div className="h-full flex flex-col bg-card border-l border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Settings" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Question Selected</h4>
            <p className="text-muted-foreground max-w-sm">
              Select a question from the form preview to edit its properties and settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'validation', name: 'Validation', icon: 'Shield' },
    { id: 'logic', name: 'Logic', icon: 'GitBranch' },
    { id: 'styling', name: 'Styling', icon: 'Palette' }
  ];

  const validationRules = [
    { value: 'required', label: 'Required Field' },
    { value: 'minLength', label: 'Minimum Length' },
    { value: 'maxLength', label: 'Maximum Length' },
    { value: 'pattern', label: 'Pattern Validation' },
    { value: 'email', label: 'Email Format' },
    { value: 'number', label: 'Number Only' }
  ];

  const conditionalOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' }
  ];

  const handlePropertyChange = (property, value) => {
    onUpdateQuestion({
      ...selectedQuestion,
      [property]: value
    });
  };

  const handleValidationChange = (rule, enabled) => {
    const validation = { ...selectedQuestion?.validation };
    if (enabled) {
      validation[rule] = true;
    } else {
      delete validation?.[rule];
    }
    handlePropertyChange('validation', validation);
  };

  const addOption = () => {
    const options = [...(selectedQuestion?.options || [])];
    options?.push({ value: `option_${options?.length + 1}`, label: `Option ${options?.length + 1}` });
    handlePropertyChange('options', options);
  };

  const updateOption = (index, field, value) => {
    const options = [...selectedQuestion?.options];
    options[index] = { ...options?.[index], [field]: value };
    handlePropertyChange('options', options);
  };

  const removeOption = (index) => {
    const options = selectedQuestion?.options?.filter((_, i) => i !== index);
    handlePropertyChange('options', options);
  };

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <Input
        label="Question Label"
        type="text"
        value={selectedQuestion?.label || ''}
        onChange={(e) => handlePropertyChange('label', e?.target?.value)}
        placeholder="Enter question label"
      />

      <Input
        label="Description"
        type="text"
        value={selectedQuestion?.description || ''}
        onChange={(e) => handlePropertyChange('description', e?.target?.value)}
        placeholder="Optional description"
        description="Help text shown below the question"
      />

      <Input
        label="Placeholder Text"
        type="text"
        value={selectedQuestion?.placeholder || ''}
        onChange={(e) => handlePropertyChange('placeholder', e?.target?.value)}
        placeholder="Enter placeholder text"
      />

      <Input
        label="Field Name"
        type="text"
        value={selectedQuestion?.name || ''}
        onChange={(e) => handlePropertyChange('name', e?.target?.value)}
        placeholder="field_name"
        description="Used for form submission data"
      />

      {/* Options for select/radio/checkbox */}
      {['select', 'radio', 'checkbox']?.includes(selectedQuestion?.type) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Options</label>
            <Button variant="outline" size="xs" onClick={addOption} iconName="Plus">
              Add Option
            </Button>
          </div>
          
          <div className="space-y-2">
            {(selectedQuestion?.options || [])?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={option?.label}
                  onChange={(e) => updateOption(index, 'label', e?.target?.value)}
                  placeholder="Option label"
                  className="flex-1"
                />
                <Input
                  type="text"
                  value={option?.value}
                  onChange={(e) => updateOption(index, 'value', e?.target?.value)}
                  placeholder="Value"
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                  className="w-8 h-8 text-error"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Validation Rules</label>
        {validationRules?.map((rule) => (
          <Checkbox
            key={rule?.value}
            label={rule?.label}
            checked={selectedQuestion?.validation?.[rule?.value] || false}
            onChange={(e) => handleValidationChange(rule?.value, e?.target?.checked)}
          />
        ))}
      </div>

      {selectedQuestion?.validation?.minLength && (
        <Input
          label="Minimum Length"
          type="number"
          value={selectedQuestion?.validation?.minLengthValue || ''}
          onChange={(e) => handlePropertyChange('validation', {
            ...selectedQuestion?.validation,
            minLengthValue: parseInt(e?.target?.value)
          })}
          placeholder="0"
        />
      )}

      {selectedQuestion?.validation?.maxLength && (
        <Input
          label="Maximum Length"
          type="number"
          value={selectedQuestion?.validation?.maxLengthValue || ''}
          onChange={(e) => handlePropertyChange('validation', {
            ...selectedQuestion?.validation,
            maxLengthValue: parseInt(e?.target?.value)
          })}
          placeholder="100"
        />
      )}

      <Input
        label="Error Message"
        type="text"
        value={selectedQuestion?.errorMessage || ''}
        onChange={(e) => handlePropertyChange('errorMessage', e?.target?.value)}
        placeholder="This field is required"
        description="Custom error message for validation failures"
      />
    </div>
  );

  const renderLogicTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Conditional Logic</label>
        <Checkbox
          checked={selectedQuestion?.conditionalLogic?.enabled || false}
          onChange={(e) => handlePropertyChange('conditionalLogic', {
            ...selectedQuestion?.conditionalLogic,
            enabled: e?.target?.checked
          })}
        />
      </div>

      {selectedQuestion?.conditionalLogic?.enabled && (
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Show this question when:
          </div>

          <Select
            label="Source Question"
            options={[
              { value: 'q1', label: 'Product Category' },
              { value: 'q2', label: 'Product Type' },
              { value: 'q3', label: 'Price Range' }
            ]}
            value={selectedQuestion?.conditionalLogic?.sourceQuestion || ''}
            onChange={(value) => handlePropertyChange('conditionalLogic', {
              ...selectedQuestion?.conditionalLogic,
              sourceQuestion: value
            })}
            placeholder="Select question"
          />

          <Select
            label="Condition"
            options={conditionalOperators}
            value={selectedQuestion?.conditionalLogic?.operator || ''}
            onChange={(value) => handlePropertyChange('conditionalLogic', {
              ...selectedQuestion?.conditionalLogic,
              operator: value
            })}
            placeholder="Select condition"
          />

          <Input
            label="Value"
            type="text"
            value={selectedQuestion?.conditionalLogic?.value || ''}
            onChange={(e) => handlePropertyChange('conditionalLogic', {
              ...selectedQuestion?.conditionalLogic,
              value: e?.target?.value
            })}
            placeholder="Enter value"
          />

          <div className="text-xs text-muted-foreground p-2 bg-background rounded border">
            <Icon name="Info" size={12} className="inline mr-1" />
            This question will only appear when the selected condition is met
          </div>
        </div>
      )}
    </div>
  );

  const renderStylingTab = () => (
    <div className="space-y-4">
      <Select
        label="Field Width"
        options={[
          { value: 'full', label: 'Full Width' },
          { value: 'half', label: 'Half Width' },
          { value: 'third', label: 'One Third' },
          { value: 'quarter', label: 'One Quarter' }
        ]}
        value={selectedQuestion?.width || 'full'}
        onChange={(value) => handlePropertyChange('width', value)}
      />

      <Select
        label="Label Position"
        options={[
          { value: 'top', label: 'Above Field' },
          { value: 'left', label: 'Left of Field' },
          { value: 'hidden', label: 'Hidden' }
        ]}
        value={selectedQuestion?.labelPosition || 'top'}
        onChange={(value) => handlePropertyChange('labelPosition', value)}
      />

      <Checkbox
        label="Show in Summary"
        checked={selectedQuestion?.showInSummary || false}
        onChange={(e) => handlePropertyChange('showInSummary', e?.target?.checked)}
        description="Include this field in form summary"
      />

      <Checkbox
        label="Read Only"
        checked={selectedQuestion?.readOnly || false}
        onChange={(e) => handlePropertyChange('readOnly', e?.target?.checked)}
        description="Make this field non-editable"
      />

      <Input
        label="CSS Classes"
        type="text"
        value={selectedQuestion?.cssClasses || ''}
        onChange={(e) => handlePropertyChange('cssClasses', e?.target?.value)}
        placeholder="custom-class another-class"
        description="Additional CSS classes for styling"
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Properties</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <Icon name="X" size={16} />
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Icon name={selectedQuestion?.icon} size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{selectedQuestion?.type}</span>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'validation' && renderValidationTab()}
        {activeTab === 'logic' && renderLogicTab()}
        {activeTab === 'styling' && renderStylingTab()}
      </div>
      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuestion({ ...selectedQuestion })}
            iconName="Copy"
            iconPosition="left"
          >
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {/* Handle delete */}}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;