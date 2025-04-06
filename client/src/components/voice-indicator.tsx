import { Mic } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type VoiceIndicatorProps = {
  isActive: boolean;
};

export default function VoiceIndicator({ isActive }: VoiceIndicatorProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-6 right-6 z-50 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full p-4 shadow-xl"
        >
          <div className="relative flex items-center">
            <Mic className="h-6 w-6" />
            <motion.span 
              className="ml-2 font-medium text-sm"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ delay: 0.2 }}
            >
              Listening...
            </motion.span>
            
            <motion.div
              className="absolute -inset-1 rounded-full border-2 border-white opacity-75"
              initial={{ scale: 1 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            
            <motion.div
              className="absolute -inset-2 rounded-full border border-white opacity-50"
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
