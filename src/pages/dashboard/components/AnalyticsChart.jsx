import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsChart = ({ data = [], type = 'bar', title, description }) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('7d');

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart', icon: 'BarChart3' },
    { value: 'line', label: 'Line Chart', icon: 'TrendingUp' },
    { value: 'pie', label: 'Pie Chart', icon: 'PieChart' }
  ];

  const colors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-muted-foreground">{entry?.dataKey}:</span>
              <span className="text-sm font-medium text-foreground">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#2563EB" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {timeRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setTimeRange(option?.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === option?.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
          
          {/* Chart Type Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {chartTypeOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={chartType === option?.value ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setChartType(option?.value)}
                className="w-8 h-8"
              >
                <Icon name={option?.icon} size={16} />
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full" aria-label={`${title} ${chartType} Chart`}>
        {data?.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No Data Available</h4>
              <p className="text-muted-foreground">
                Start collecting form submissions to see analytics here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;