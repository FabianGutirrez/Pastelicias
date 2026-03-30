
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, title, message, type = 'success' }) => {
    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle2 className="w-14 h-14 text-green-600" />,
                    bg: 'bg-green-50/50',
                    border: 'border-green-100',
                    button: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200',
                    accent: 'bg-green-600',
                    gradient: 'from-green-50 to-white'
                };
            case 'error':
                return {
                    icon: <AlertCircle className="w-14 h-14 text-red-600" />,
                    bg: 'bg-red-50/50',
                    border: 'border-red-100',
                    button: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200',
                    accent: 'bg-red-600',
                    gradient: 'from-red-50 to-white'
                };
            case 'warning':
                return {
                    icon: <ShieldAlert className="w-14 h-14 text-amber-600" />,
                    bg: 'bg-amber-50/50',
                    border: 'border-amber-100',
                    button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200',
                    accent: 'bg-amber-600',
                    gradient: 'from-amber-50 to-white'
                };
            case 'info':
            default:
                return {
                    icon: <Info className="w-14 h-14 text-rose-gold" />,
                    bg: 'bg-cream/50',
                    border: 'border-rose-gold/20',
                    button: 'bg-rose-gold hover:bg-opacity-90 text-cocoa-brown shadow-lg shadow-rose-gold/20',
                    accent: 'bg-rose-gold',
                    gradient: 'from-cream to-white'
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
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className={`relative bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full border ${styles.border} flex flex-col`}
                    >
                        {/* Decorative Background Element */}
                        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${styles.gradient} opacity-50`} />
                        
                        <div className="relative p-8 sm:p-10 flex flex-col items-center">
                            <button 
                                onClick={onClose}
                                className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/5 transition-colors group z-10"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-cocoa-brown" />
                            </button>

                            <motion.div 
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                                className={`w-28 h-28 ${styles.bg} rounded-full flex items-center justify-center mb-8 shadow-inner border-4 border-white relative z-10`}
                            >
                                {styles.icon}
                            </motion.div>

                            <div className="text-center relative z-10 w-full">
                                <h3 className="text-3xl font-serif font-bold text-cocoa-brown mb-4 tracking-tight leading-tight">{title}</h3>
                                <p className="text-muted-mauve mb-10 leading-relaxed text-lg font-medium">
                                    {message}
                                </p>
                                
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${styles.button}`}
                                >
                                    Entendido
                                </motion.button>
                            </div>
                        </div>
                        
                        {/* Bottom Accent */}
                        <div className={`h-2 w-full ${styles.accent} opacity-80`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NotificationModal;