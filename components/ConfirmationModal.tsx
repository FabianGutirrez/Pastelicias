
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar',
    type = 'warning'
}) => {
    const getStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
                    bg: 'bg-red-50',
                    border: 'border-red-100',
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200',
                    accent: 'bg-red-600',
                    lightAccent: 'bg-red-100/50'
                };
            case 'info':
                return {
                    icon: <AlertTriangle className="w-10 h-10 text-blue-600" />,
                    bg: 'bg-blue-50',
                    border: 'border-blue-100',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200',
                    accent: 'bg-blue-600',
                    lightAccent: 'bg-blue-100/50'
                };
            case 'warning':
            default:
                return {
                    icon: <AlertTriangle className="w-10 h-10 text-amber-600" />,
                    bg: 'bg-amber-50',
                    border: 'border-amber-100',
                    confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200',
                    accent: 'bg-amber-600',
                    lightAccent: 'bg-amber-100/50'
                };
        }
    };

    const styles = getStyles();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-cocoa-brown/60 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.9, opacity: 0, x: 20 }}
                        className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-lg w-full flex flex-col md:flex-row"
                    >
                        {/* Left Side - Visual Indicator */}
                        <div className={`w-full md:w-32 ${styles.lightAccent} flex items-center justify-center p-6 md:p-0`}>
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`w-16 h-16 rounded-2xl ${styles.bg} flex items-center justify-center shadow-sm border border-white/50`}
                            >
                                {styles.icon}
                            </motion.div>
                        </div>
                        
                        {/* Right Side - Content */}
                        <div className="flex-1 p-8 md:p-10 relative">
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors group"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-cocoa-brown" />
                            </button>

                            <div className="mb-8">
                                <h3 className="text-2xl font-serif font-bold text-cocoa-brown mb-3 leading-tight">{title}</h3>
                                <p className="text-muted-mauve leading-relaxed">
                                    {message}
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex-1 py-3.5 px-6 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                                >
                                    {cancelText}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold transition-all duration-300 ${styles.confirmButton}`}
                                >
                                    {confirmText}
                                </motion.button>
                            </div>
                        </div>

                        {/* Decorative Accent Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.accent} hidden md:block`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;