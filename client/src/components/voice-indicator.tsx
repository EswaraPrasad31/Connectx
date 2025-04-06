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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-5 right-5 z-50 bg-[#00D166] text-white rounded-full p-3 shadow-lg"
        >
          <div className="relative">
            <Mic className="h-6 w-6" />
            <motion.div
              className="absolute -inset-1 rounded-full border-2 border-white opacity-75"
              initial={{ scale: 1 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
