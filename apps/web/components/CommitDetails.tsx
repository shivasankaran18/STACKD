import { GitCommit } from '@/types/git';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommitDetailsProps {
  commit: GitCommit;
  onClose: () => void;
}

export function CommitDetails({ commit, onClose }: CommitDetailsProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-[73px] right-0 w-[400px] h-[calc(100vh-73px)] bg-[#1e1e1e] border-l border-neutral-800 overflow-y-auto"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold">Commit Details</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-800 bg-purple-900">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              src={commit.avatarUrl}
              alt={commit.author}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium">{commit.author}</h3>
              <p className="text-sm text-neutral-400">
                {commit.id}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-medium text-neutral-400 mb-1">Message</h4>
            <p className="text-sm whitespace-pre-wrap">{commit.message}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-medium text-neutral-400 mb-1">Commit Hash</h4>
            <p className="text-sm font-mono bg-neutral-900 p-2 rounded">{commit.id}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-medium text-neutral-400 mb-1">Branch</h4>
            <p className="text-sm">{commit.branch}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}