import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

type StepperProps = {
  classname: string;
  currentStep: number;
  steps: string[];
};

export const Stepper: React.FC<StepperProps> = ({
  classname,
  currentStep,
  steps,
}) => {
  const stepsNb = steps.length;

  return (
    <div
      className={cn('grid gap-y-4', classname)}
      style={{
        gridTemplateColumns: `repeat(${stepsNb}, minmax(0, 1fr))`,
        maxWidth: stepsNb * 350,
      }}
      aria-label="Progress indicator"
    >
      {steps.map((step, index) => {
        const isActive = currentStep >= index;
        const isCompleted = currentStep > index;

        return (
          <div key={step} className="flex w-full flex-col items-center">
            <div className="relative w-full">
              {index < stepsNb - 1 && (
                <span
                  className={cn(
                    'absolute top-1/2 right-0 h-px w-1/2 translate-x-1/2 -translate-y-1/2 rounded-full',
                    isCompleted ? 'bg-foreground' : 'bg-intermediate'
                  )}
                />
              )}
              <div
                className={cn(
                  'mx-auto flex size-8 items-center justify-center rounded-full',
                  isActive ? 'bg-foreground text-background' : 'bg-muted',
                  isCompleted && 'bg-brand text-background'
                )}
                aria-label={`Step ${index + 1}`}
              >
                {isCompleted ? (
                  <Check size="16" strokeWidth="2.5" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
            <span
              className={cn(
                'mt-2 text-center',
                isActive ? 'text-foreground' : 'text-intermediate'
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};
