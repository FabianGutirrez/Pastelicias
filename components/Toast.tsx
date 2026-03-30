
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                    bg: 'bg-white/95',
                    border: 'border-green-100',
                    text: 'text-green-900',
                    accent: 'bg-green-600',
                    shadow: 'shadow-green-100'
                };
            case 'error':
                return {
                    icon: <AlertCircle className="w-5 h-5 text-red-600" />,
                    bg: 'bg-white/95',
                    border: 'border-red-100',
                    text: 'text-red-900',
                    accent: 'bg-red-600',
                    shadow: 'shadow-red-100'
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
                    bg: 'bg-white/95',
                    border: 'border-amber-100',
                    text: 'text-amber-900',
                    accent: 'bg-amber-600',
                    shadow: 'shadow-amber-100'
                };
            case 'info':
            default:
                return {
                    icon: <Info className="w-5 h-5 text-rose-gold" />,
                    bg: 'bg-white/95',
                    border: 'border-rose-gold/20',
                    text: 'text-cocoa-brown',
                    accent: 'bg-rose-gold',
                    shadow: 'shadow-rose-gold/10'
                };
        }
    };

    const styles = getStyles();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
                    className="fixed bottom-10 left-1/2 z-[200] w-full max-w-md px-4"
                >
                    <div className={`${styles.bg} ${styles.border} border-2 rounded-2xl shadow-2xl p-4 flex items-center gap-4 backdrop-blur-xl ${styles.shadow}`}>
                        <motion.div 
                            initial={{ rotate: -20, scale: 0.5 }}
                            animate={{ rotate: 0, scale: 1 }}
                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${styles.bg} shadow-sm border ${styles.border}`}
                        >
                            {styles.icon}
                        </motion.div>
                        <div className="flex-grow">
                            <p className={`text-sm font-bold ${styles.text} leading-tight`}>
                                {message}
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-black/5 transition-colors group"
                        >
                            <X className="w-4 h-4 text-gray-400 group-hover:text-cocoa-brown" />
                        </button>
                        
                        {/* Progress bar for auto-close */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/50 rounded-b-2xl overflow-hidden">
                            <motion.div 
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: duration / 1000, ease: 'linear' }}
                                className={`h-full ${styles.accent}`}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;