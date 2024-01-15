
const Toast = ({
    show = false,
    message,
    alertType = 'info',
    className = '',
    ...props
}) => {
    return (
        <>
            {show && (
                <div
                    className={
                        `toast ` + (className || 'toast-center toast-bottom')
                    }
                    {...props}
                >
                    <div className={`alert alert-${alertType}`}>
                        <span>{message}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default Toast;
