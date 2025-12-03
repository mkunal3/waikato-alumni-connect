import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TypingIndicator() {
  const mentorAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop";

  return (
    <div className="flex gap-3 items-end">
      <ImageWithFallback
        src={mentorAvatar}
        alt="Mentor"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm"
      />
      
      <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-500 mr-2">Mentor is typing</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
