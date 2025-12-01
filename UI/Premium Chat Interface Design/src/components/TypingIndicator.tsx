import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TypingIndicator() {
  const mentorAvatar = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E";

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
