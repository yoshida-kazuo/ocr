import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea({
    className='',
    isFocused=false,
    ...props
}, ref) {
    const textarea = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            textarea.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'textarea textarea-bordered textarea-md w-full '
                + className
            }
            ref={textarea}
        />
    );
});
