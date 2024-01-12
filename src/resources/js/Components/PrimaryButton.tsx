import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { PrimaryButtonProps } from '@/Interfaces/Components';

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    className = '',
    children,
    ...props
}) => {
    return (
        <button
            {...props}
            className={`btn btn-primary ${props.disabled ? 'btn-disabled' : ''} ${className}`}
            disabled={props.disabled}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
