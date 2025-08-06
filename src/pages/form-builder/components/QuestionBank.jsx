import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionBank = ({ onAddQuestion, onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(['basic']);

  const questionCategories = [
    {
      id: 'basic',
      name: 'Basic Fields',
      icon: 'Type',
      questions: [
        { id: 'text', name: 'Text Input', icon: 'Type', description: 'Single line text field' },
        { id: 'textarea', name: 'Text Area', icon: 'AlignLeft', description: 'Multi-line text field' },
        { id: 'number', name: 'Number', icon: 'Hash', description: 'Numeric input field' },
        { id: 'email', name: 'Email', icon: 'Mail', description: 'Email address field' },
        { id: 'phone', name: 'Phone', icon: 'Phone', description: 'Phone number field' },
        { id: 'date', name: 'Date', icon: 'Calendar', description: 'Date picker field' }
      ]
    },
    {
      id: 'selection',
      name: 'Selection Fields',
      icon: 'CheckSquare',
      questions: [
        { id: 'select', name: 'Dropdown', icon: 'ChevronDown', description: 'Single selection dropdown' },
        { id: 'radio', name: 'Radio Group', icon: 'Circle', description: 'Single choice options' },
        { id: 'checkbox', name: 'Checkbox Group', icon: 'CheckSquare', description: 'Multiple choice options' },
        { id: 'rating', name: 'Rating', icon: 'Star', description: 'Star rating field' }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Fields',
      icon: 'Settings',
      questions: [
        { id: 'file', name: 'File Upload', icon: 'Upload', description: 'File attachment field' },
        { id: 'signature', name: 'Signature', icon: 'PenTool', description: 'Digital signature field' },
        { id: 'matrix', name: 'Matrix', icon: 'Grid', description: 'Grid of questions' },
        { id: 'section', name: 'Section Break', icon: 'Minus', description: 'Visual section separator' }
      ]
    },
    {
      id: 'product',
      name: 'Product Specific',
      icon: 'Package',
      questions: [
        { id: 'product-name', name: 'Product Name', icon: 'Tag', description: 'Product title field' },
        { id: 'product-category', name: 'Category', icon: 'Folder', description: 'Product category selector' },
        { id: 'price', name: 'Price', icon: 'DollarSign', description: 'Price input field' },
        { id: 'specifications', name: 'Specifications', icon: 'List', description: 'Product specs table' },
        { id: 'images', name: 'Product Images', icon: 'Image', description: 'Multiple image upload' }
      ]
    }
  ];

  const filteredCategories = questionCategories?.map(category => ({
    ...category,
    questions: category?.questions?.filter(question =>
      question?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      question?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  }))?.filter(category => category?.questions?.length > 0);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev?.includes(categoryId)
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDragStart = (e, question) => {
    e?.dataTransfer?.setData('application/json', JSON.stringify(question));
    onDragStart && onDragStart(question);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Question Bank</h3>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredCategories?.map((category) => (
          <div key={category?.id} className="space-y-2">
            <button
              onClick={() => toggleCategory(category?.id)}
              className="w-full flex items-center justify-between p-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Icon name={category?.icon} size={16} />
                <span>{category?.name}</span>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className={`transition-transform ${expandedCategories?.includes(category?.id) ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedCategories?.includes(category?.id) && (
              <div className="space-y-1 ml-4">
                {category?.questions?.map((question) => (
                  <div
                    key={question?.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, question)}
                    className="group flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary hover:shadow-sm cursor-move transition-all"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Icon name={question?.icon} size={16} className="text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{question?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{question?.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAddQuestion(question)}
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Plus" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredCategories?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No questions found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;