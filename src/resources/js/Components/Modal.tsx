import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ModalProps } from '@/Interfaces/Components';

const Modal: React.FC<ModalProps> = ({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {}
}) => {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-50 transform transition-all"
                onClose={close}
            >
                {/* 中略: その他のコンポーネントの定義 */}
            </Dialog>
        </Transition>
    );
};

export default Modal;
