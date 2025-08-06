import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const ReportPreview = ({ template, dataSources, isGenerating, onGenerate }) => {
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [showFieldCustomization, setShowFieldCustomization] = useState(false);

  const mockReportData = {
    title: template?.name || 'Report Preview',
    generatedDate: new Date()?.toLocaleDateString(),
    totalSubmissions: 156,
    dateRange: 'Last 30 days',
    sections: [
      {
        id: 'summary',
        title: 'Executive Summary',
        content: `This report provides a comprehensive analysis of product data collected through our forms system. Based on ${156} submissions over the last 30 days, we have identified key trends and insights that will inform our product strategy moving forward.`
      },
      {
        id: 'metrics',
        title: 'Key Metrics',
        type: 'metrics',
        data: [
          { label: 'Total Products', value: '156', change: '+12%' },
          { label: 'Avg. Rating', value: '4.2', change: '+0.3' },
          { label: 'Completion Rate', value: '94%', change: '+2%' },
          { label: 'Response Time', value: '3.2 min', change: '-15%' }
        ]
      },
      {
        id: 'chart',
        title: 'Submission Trends',
        type: 'chart',
        description: 'Daily submission volume over the selected period'
      },
      {
        id: 'products',
        title: 'Product Highlights',
        type: 'table',
        data: [
          { name: 'Wireless Headphones Pro', category: 'Electronics', rating: 4.8, submissions: 23 },
          { name: 'Smart Home Hub', category: 'IoT', rating: 4.5, submissions: 19 },
          { name: 'Fitness Tracker Elite', category: 'Wearables', rating: 4.3, submissions: 17 }
        ]
      }
    ]
  };

  const previewSizes = {
    desktop: { width: '100%', scale: 1 },
    tablet: { width: '768px', scale: 0.8 },
    mobile: { width: '375px', scale: 0.7 }
  };

  const renderMetricsSection = (section) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {section?.data?.map((metric, index) => (
        <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
          <div className="text-sm text-muted-foreground mb-2">{metric?.label}</div>
          <div className={`text-xs font-medium ${metric?.change?.startsWith('+') ? 'text-success' : 'text-error'}`}>
            {metric?.change}
          </div>
        </div>
      ))}
    </div>
  );

  const renderChartSection = () => (
    <div className="bg-muted/30 p-6 rounded-lg border border-border mb-6">
      <div className="h-48 flex items-center justify-center">
        <div className="text-center">
          <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Chart visualization will appear here</p>
        </div>
      </div>
    </div>
  );

  const renderTableSection = (section) => (
    <div className="bg-muted/30 rounded-lg border border-border mb-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Submissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {section?.data?.map((row, index) => (
              <tr key={index} className="hover:bg-muted/50">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{row?.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{row?.category}</td>
                <td className="px-4 py-3 text-sm text-foreground">
                  <div className="flex items-center">
                    <Icon name="Star" size={14} className="text-warning mr-1" />
                    {row?.rating}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{row?.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!template) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-border">
        <div className="text-center">
          <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Template</h3>
          <p className="text-muted-foreground">Choose a report template to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Report Preview</h3>
          <div className="flex items-center space-x-2">
            {Object.keys(previewSizes)?.map(size => (
              <button
                key={size}
                onClick={() => setPreviewMode(size)}
                className={`
                  px-3 py-1 text-xs rounded-md transition-colors
                  ${previewMode === size 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                <Icon 
                  name={size === 'desktop' ? 'Monitor' : size === 'tablet' ? 'Tablet' : 'Smartphone'} 
                  size={12} 
                  className="mr-1" 
                />
                {size?.charAt(0)?.toUpperCase() + size?.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFieldCustomization(!showFieldCustomization)}
            iconName="Settings"
            iconPosition="left"
            iconSize={16}
          >
            Customize
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onGenerate}
            loading={isGenerating}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Generate PDF
          </Button>
        </div>
      </div>
      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="flex justify-center">
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: previewSizes?.[previewMode]?.width,
              transform: `scale(${previewSizes?.[previewMode]?.scale})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Report Header */}
            <div className="bg-primary text-primary-foreground p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{mockReportData?.title}</h1>
                  <p className="text-primary-foreground/80">
                    Generated on {mockReportData?.generatedDate} • {mockReportData?.dateRange}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{mockReportData?.totalSubmissions}</div>
                  <div className="text-sm text-primary-foreground/80">Total Submissions</div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {mockReportData?.sections?.map(section => (
                <div key={section?.id} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{section?.title}</h2>
                  
                  {section?.type === 'metrics' && renderMetricsSection(section)}
                  {section?.type === 'chart' && renderChartSection()}
                  {section?.type === 'table' && renderTableSection(section)}
                  {!section?.type && (
                    <p className="text-gray-700 leading-relaxed">{section?.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Report Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>ProductForm Pro • Confidential Report</div>
                <div>Page 1 of 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Field Customization Panel */}
      {showFieldCustomization && (
        <div className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border shadow-lg z-10">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Customize Fields</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFieldCustomization(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">Report Sections</h5>
              <div className="space-y-2">
                {mockReportData?.sections?.map(section => (
                  <label key={section?.id} className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm text-foreground">{section?.title}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">Branding</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Company Logo</label>
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="Upload" size={14} className="mr-2" />
                    Upload Logo
                  </Button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Header Color</label>
                  <input
                    type="color"
                    defaultValue="#2563EB"
                    className="w-full h-10 rounded border border-border"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;