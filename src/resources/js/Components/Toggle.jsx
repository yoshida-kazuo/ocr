export default function Toggle({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'toggle ' +
                className
            }
        />
    );
}
