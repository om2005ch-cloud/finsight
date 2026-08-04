import { motion } from 'framer-motion';

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-950">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-emerald-600/30 blur-[120px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-teal-500/30 blur-[120px]"
        animate={{
          x: [0, -100, 80, 0],
          y: [0, 100, -60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '10%', right: '10%' }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-green-400/20 blur-[100px]"
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -60, 40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '50%', left: '50%' }}
      />
    </div>
  );
}

export default AnimatedBackground;