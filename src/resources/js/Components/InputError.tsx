import React from "react";
import { InputErrorProps } from "@/Interfaces/Components";

const InputError: React.FC<InputErrorProps> = ({
    message,
    className = '',
    ...props
}) => {
    return message ? (
        <p {...props} className={`text-sm text-red-600 ${className}`}>
            {message}
        </p>
    ) : null;
};

export default InputError;
