import React from 'react';
import Modal from './Modal';
import DangerButton from './DangerButton';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';
import { AlertCircle, Trash2, Edit3, PlusCircle } from 'lucide-react';

export default function ConfirmationModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = 'Konfirmasi Tindakan', 
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?', 
    confirmText = 'Ya, Lanjutkan', 
    cancelText = 'Batal',
    type = 'danger' // danger, warning, success, info
}) {
    
    const getIcon = () => {
        switch (type) {
            case 'danger': return <Trash2 className="w-12 h-12 text-rose-500" />;
            case 'warning': return <AlertCircle className="w-12 h-12 text-amber-500" />;
            case 'success': return <PlusCircle className="w-12 h-12 text-emerald-500" />;
            case 'info': return <Edit3 className="w-12 h-12 text-blue-500" />;
            default: return <AlertCircle className="w-12 h-12 text-gray-500" />;
        }
    };

    const getConfirmButton = () => {
        if (type === 'danger') {
            return <DangerButton onClick={onConfirm}>{confirmText}</DangerButton>;
        }
        return <PrimaryButton onClick={onConfirm}>{confirmText}</PrimaryButton>;
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                    {getIcon()}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600 mb-6">{message}</p>
                <div className="flex justify-center gap-3">
                    <SecondaryButton onClick={onClose}>
                        {cancelText}
                    </SecondaryButton>
                    {getConfirmButton()}
                </div>
            </div>
        </Modal>
    );
}


