import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ReportTemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      id: 'standard-product',
      name: 'Standard Product Report',
      description: 'Comprehensive product data with specifications and images',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop',
      category: 'Product',
      fields: ['Product Name', 'Description', 'Specifications', 'Images', 'Pricing'],
      isPopular: true
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview for management presentations',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=300&h=200&fit=crop',
      category: 'Executive',
      fields: ['Key Metrics', 'Summary', 'Recommendations'],
      isPopular: false
    },
    {
      id: 'detailed-analysis',
      name: 'Detailed Analysis',
      description: 'In-depth analysis with charts and data visualization',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg?w=300&h=200&fit=crop',
      category: 'Analysis',
      fields: ['Data Tables', 'Charts', 'Analysis', 'Conclusions'],
      isPopular: true
    },
    {
      id: 'compliance-report',
      name: 'Compliance Report',
      description: 'Regulatory compliance and audit documentation',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop',
      category: 'Compliance',
      fields: ['Compliance Status', 'Requirements', 'Documentation'],
      isPopular: false
    },
    {
      id: 'custom-template',
      name: 'Custom Template',
      description: 'Build your own template with custom fields',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=300&h=200&fit=crop',
      category: 'Custom',
      fields: ['Customizable Fields'],
      isPopular: false
    }
  ];

  const filteredTemplates = templates?.filter(template =>
    template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    template?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Report Templates</h3>
        
        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories?.map(category => {
          const categoryTemplates = filteredTemplates?.filter(t => t?.category === category);
          if (categoryTemplates?.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-3">
                {categoryTemplates?.map(template => (
                  <div
                    key={template?.id}
                    onClick={() => onTemplateSelect(template)}
                    className={`
                      relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md
                      ${selectedTemplate?.id === template?.id 
                        ? 'border-primary bg-primary/5' :'border-border bg-background hover:border-primary/50'
                      }
                    `}
                  >
                    {/* Popular Badge */}
                    {template?.isPopular && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                          Popular
                        </div>
                      </div>
                    )}

                    {/* Template Thumbnail */}
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={template?.thumbnail}
                        alt={template?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Template Info */}
                    <div className="p-3">
                      <h5 className="font-medium text-foreground mb-1">{template?.name}</h5>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {template?.description}
                      </p>
                      
                      {/* Fields Preview */}
                      <div className="flex flex-wrap gap-1">
                        {template?.fields?.slice(0, 3)?.map(field => (
                          <span
                            key={field}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                          >
                            {field}
                          </span>
                        ))}
                        {template?.fields?.length > 3 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{template?.fields?.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate?.id === template?.id && (
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Icon name="Check" size={14} className="text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No templates found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTemplateSelector;