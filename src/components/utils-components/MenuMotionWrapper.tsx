import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MenuMotionWrapperProps extends HTMLMotionProps<"div"> {
  index: number;
  children: ReactNode;
  duration?: number;
  ease?: string;
}

const MenuMotionWrapper: React.FC<MenuMotionWrapperProps> = ({
  children,
  index,
  duration = 0.3,
  ease = "easeInOut",
  ...props
}) => {
  const defaultVariants = {
    visible: { opacity: 1, transform: "translateX(0)" },
    hidden: { opacity: 0, transform: "translateX(-50%)" },
  };

  return (
    <motion.div
      key={index}
      initial="hidden"
      whileInView="visible"
      exit="hidden"
      transition={{ duration, ease }}
      variants={defaultVariants}
      {...props} // Spread any additional props to the motion.div
    >
      {children}
    </motion.div>
  );
};

export default MenuMotionWrapper;
