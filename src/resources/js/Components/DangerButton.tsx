import React from 'react';
import { DangerButtonProps } from '@/Interfaces/Components';

const DangerButton: React.FC<DangerButtonProps> = ({
    className = '',
    children,
    ...props
}) => {
    return (
        <button
            {...props}
            className={`btn btn-error text-white ${props.disabled && 'opacity-25'} ${className}`}
            disabled={props.disabled}
        >
            {children}
        </button>
    );
};

export default DangerButton;
