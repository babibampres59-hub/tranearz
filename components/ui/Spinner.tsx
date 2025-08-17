import React from 'react';

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className='' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-b-2'
    };
    return (
        <div className={`animate-spin rounded-full border-blue-600 border-b-transparent ${sizeClasses[size]} ${className}`} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
