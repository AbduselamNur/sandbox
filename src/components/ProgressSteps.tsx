import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  step: number;
  currentStep: number;
  label: string;
}

const ProgressSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { label: "Postcode", step: 1 },
    { label: "Waste Type", step: 2 },
    { label: "Select Skip", step: 3 },
    { label: "Permit Check", step: 4 },
    { label: "Choose Date", step: 5 },
    { label: "Payment", step: 6 },
  ];

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between">
        {steps.map(({ label, step }) => (
          <Step
            key={step}
            step={step}
            currentStep={currentStep}
            label={label}
          />
        ))}
      </div>
    </div>
  );
};

const Step = ({ step, currentStep, label }: StepProps) => {
  const isCompleted = step < currentStep;
  const isActive = step === currentStep;

  return (
    <div
      className={cn(
        "progress-step",
        isActive && "active",
        isCompleted && "completed"
      )}
    >
      <div
        className={cn(
          "step-icon",
          isActive && "bg-primary text-primary-foreground",
          isCompleted && "bg-green-600 text-white"
        )}
      >
        {isCompleted ? <Check className="w-4 h-4" /> : <span>{step}</span>}
      </div>
      <span
        className={cn(
          "step-text",
          isActive && "text-primary",
          isCompleted && "text-green-600",
          !isActive && !isCompleted && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default ProgressSteps;
