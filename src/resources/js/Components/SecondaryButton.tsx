import React from 'react';
import { SecondaryButtonProps } from '@/Interfaces/Components';

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    type = 'button',
    className = '',
    children,
    ...props
}) => {
    return (
        <button
            {...props}
            type={type}
            className={`btn btn-secondary ${props.disabled ? 'btn-disabled' : ''} ${className}`}
            disabled={props.disabled}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
