import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ items = [], separator = 'ChevronRight' }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item?.href && !item?.disabled) {
      navigate(item?.href);
    } else if (item?.onClick && !item?.disabled) {
      item?.onClick();
    }
  };

  const getItemClasses = (item, isLast) => {
    let classes = 'inline-flex items-center text-sm transition-colors duration-200 ';
    
    if (isLast) {
      classes += 'text-foreground font-medium ';
    } else if (item?.href || item?.onClick) {
      classes += 'text-muted-foreground hover:text-foreground cursor-pointer ';
    } else {
      classes += 'text-muted-foreground ';
    }
    
    if (item?.disabled) {
      classes += 'opacity-50 cursor-not-allowed ';
    }
    
    return classes;
  };

  if (!items?.length) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items?.map((item, index) => {
          const isLast = index === items?.length - 1;
          
          return (
            <li key={item?.key || index} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name={separator} 
                  size={16} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              <span
                className={getItemClasses(item, isLast)}
                onClick={() => !item?.disabled && handleItemClick(item)}
                aria-current={isLast ? 'page' : undefined}
              >
                {item?.icon && (
                  <Icon 
                    name={item?.icon} 
                    size={14} 
                    className="mr-2" 
                  />
                )}
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {item?.label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;