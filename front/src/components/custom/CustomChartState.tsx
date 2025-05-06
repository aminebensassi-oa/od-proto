import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Progress } from "@heroui/react";

interface CustomChartStateProps {
  title?: string;
  className?: string;
  theme?: "light" | "dark";
  type: "loading" | "empty" | "initializing";
  message?: string;
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center gap-4 text-center p-6">
    <Icon icon="mdi:chart-line" className="text-6xl text-default-300" />
    <div className="space-y-2">
      <p className="text-default-500">{message}</p>
      <p className="text-sm text-default-400">
        Try adjusting your filters or time range
      </p>
    </div>
  </div>
);

const InitializingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: "mdi:database-search",
      label: "Analyzing data patterns",
      detail: "Processing historical data points",
    },
    {
      icon: "mdi:chart-scatter-plot",
      label: "Generating insights",
      detail: "Identifying key trends and correlations",
    },
    {
      icon: "mdi:chart-bell-curve",
      label: "Building visualization",
      detail: "Preparing interactive chart elements",
    },
    {
      icon: "mdi:check-circle",
      label: "Finalizing",
      detail: "Optimizing for performance",
    },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 1900);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col h-[400px] justify-center items-center gap-6 text-center p-6 w-full max-w-md">
      <div className="relative mb-2">
        <div className="absolute inset-0 bg-primary-400/20 rounded-full animate-ping" />
        <div className="relative border-1 border-gray-200 dark:border-gray-800 p-4 rounded-full ">
          <Icon icon="lucide:bot" className="text-xl text-gray-600" />
        </div>
      </div>

      <div className="w-full">
        <Progress
          size="sm"
          value={progress}
          color="primary"
          className="max-w-md"
        />
      </div>

      <div className="space-y-4 w-full">
        <div className="flex items-center gap-3 bg-default-50 dark:bg-gray-950 p-4 rounded-xl transition-all duration-500">
          <Icon
            icon={steps[currentStep].icon}
            className="text-2xl text-primary-500"
          />
          <div className="text-left">
            <p className="font-medium text-default-700">
              {steps[currentStep].label}
            </p>
            <p className="text-sm text-default-400">
              {steps[currentStep].detail}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "bg-primary-500 w-4"
                : index < currentStep
                  ? "bg-primary-200"
                  : "bg-default-200"
            }`}
          />
        ))}
      </div>

      <div className="w-full space-y-2">
        {steps.map(
          (step, index) =>
            index < currentStep && (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-default-400 animate-fadeIn"
              >
                <Icon icon="mdi:check" className="text-success-500" />
                <span>{step.label}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
};

// const AIBuildingEffect = () => {
//   const [dataPoints, setDataPoints] = useState<number[]>([]);
//   const maxPoints = 10;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDataPoints((prev) => {
//         if (prev.length >= maxPoints) return prev;
//         return [...prev, Math.random() * 100];
//       });
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   const chartHeight = 400;
//   const chartWidth = 400;

//   return (
//     <div className="relative w-full">
//       <div className="relative h-[400px] p-4 overflow-hidden">
//         <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-4">
//           {Array.from({ length: 48 }).map((_, i) => (
//             <motion.div
//               key={i}
//               className="bg-default-200/30"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               transition={{
//                 duration: 0.2,
//                 delay: i * 0.02,
//                 repeat: Infinity,
//                 repeatType: "reverse",
//               }}
//             />
//           ))}
//         </div>

//         <motion.div
//           className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent"
//           initial={{ y: -300 }}
//           animate={{ y: 300 }}
//           transition={{
//             duration: 2,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//         />

//         <div className="relative h-full">
//           <motion.div
//             className="absolute left-0 h-full w-px bg-white"
//             initial={{ scaleY: 0 }}
//             animate={{ scaleY: 1 }}
//             transition={{ duration: 0.5 }}
//           />

//           <motion.div
//             className="absolute bottom-0 w-full h-px bg-white"
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//           />

//           <svg
//             className="absolute inset-0"
//             viewBox={`0 0 ${chartWidth} ${chartHeight}`}
//           >
//             <motion.path
//               d={`M ${dataPoints
//                 .map(
//                   (point, i) =>
//                     `${(i * chartWidth) / maxPoints},${chartHeight - (point * chartHeight) / 100}`
//                 )
//                 .join(" L ")}`}
//               fill="none"
//               stroke="var(--primary-500)"
//               strokeWidth="2"
//               initial={{ pathLength: 0 }}
//               animate={{ pathLength: 1 }}
//               transition={{ duration: 0.5 }}
//             />
//           </svg>

//           <div className="absolute top-4 right-4 flex items-center gap-2">
//             <motion.div
//               className="w-2 h-2 rounded-full bg-primary-500"
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [1, 0.5, 1],
//               }}
//               transition={{
//                 duration: 1,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />
//             <span className="text-xs text-default-500">AI Processing</span>
//           </div>

//           <div className="absolute left-4 top-4 space-y-2">
//             {dataPoints.map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="flex items-center gap-2"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: i * 0.2 }}
//               >
//                 <Icon
//                   icon="mdi:chart-bell-curve"
//                   className="text-primary-500"
//                 />
//                 <span className="text-xs text-default-500">
//                   Analyzing data {i + 1}
//                 </span>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {Array.from({ length: 5 }).map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute"
//             initial={{
//               opacity: 0,
//               scale: 0,
//               x: Math.random() * chartWidth,
//               y: Math.random() * chartHeight,
//             }}
//             animate={{
//               opacity: [0, 1, 0],
//               scale: [0.8, 1, 0.8],
//               y: "-=50",
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               delay: i * 0.4,
//               ease: "easeInOut",
//             }}
//           >
//             <div className="bg-white/90 px-2 py-1 rounded-md shadow-lg text-xs text-default-700">
//               {["Σ", "μ", "σ", "Δ", "∫"][i]}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

export const CustomChartState: React.FC<CustomChartStateProps> = ({
  title,
  className = "",
  theme = "light",
  type,
  message,
}) => {
  const isDark = theme === "dark";

  return (
    <div className={className}>
      <style>{styles}</style>
      {title && (
        <div
          className={`p-4 font-medium text-lg ${isDark ? "text-white" : "text-default-700"}`}
        >
          {title}
        </div>
      )}
      <div
        className={`min-h-[300px] flex items-center justify-center ${isDark ? "bg-default-800" : "bg-white dark:bg-gray-950"}`}
      >
        {type === "loading" ? (
          <InitializingState />
        ) : type === "empty" ? (
          <EmptyState message={message || "No chart data available"} />
        ) : (
          <InitializingState />
        )}
      </div>
    </div>
  );
};

export default CustomChartState;
