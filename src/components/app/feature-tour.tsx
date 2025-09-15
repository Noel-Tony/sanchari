
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Popover,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useTour } from '@/hooks/use-tour';
import { useLanguage } from '@/context/language-context';

type TourStep = {
  id: string;
  title: string;
  content: string;
  target: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
};

const tourSteps: TourStep[] = [
  {
    id: 'step-1',
    title: 'Welcome to TripMapper!',
    content: 'This is the main dashboard where you can start and manage your trips.',
    target: '[data-tour-id="dashboard"]',
    side: 'right',
    align: 'start',
  },
  {
    id: 'step-2',
    title: 'Start a Trip',
    content: 'Click here to begin recording a new trip. Make sure your location is enabled.',
    target: '[data-tour-id="start-trip-button"]',
    side: 'bottom',
    align: 'center',
  },
   {
    id: 'step-3',
    title: 'Enable Location',
    content: 'You can enable or disable location tracking at any time using this switch.',
    target: '[data-tour-id="location-toggle"]',
    side: 'bottom',
    align: 'end',
  },
  {
    id: 'step-4',
    title: 'Trip History',
    content: 'View all your past trips and their details on this page.',
    target: '[data-tour-id="history"]',
    side: 'right',
    align: 'start',
  },
  {
    id: 'step-5',
    title: 'Your Statistics',
    content: 'Check out visualizations and stats about your travel habits here.',
    target: '[data-tour-id="stats"]',
    side: 'right',
    align: 'start',
  },
  {
    id: 'step-6',
    title: 'Get Help',
    content: 'If you ever need a reminder, click here for help and FAQs.',
    target: '[data-tour-id="help"]',
    side: 'bottom',
    align: 'end',
  },
];


export default function FeatureTour({ onTourComplete }: { onTourComplete: () => void }) {
  const { tourActive, setTourActive } = useTour();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const currentStep = useMemo(() => tourSteps[currentStepIndex], [currentStepIndex]);

  useEffect(() => {
    if (!tourActive || !currentStep) return;

    const interval = setInterval(() => {
        const element = document.querySelector(currentStep.target) as HTMLElement;
        if (element) {
            setTargetElement(element);
            const rect = element.getBoundingClientRect();
            setPopoverPosition(rect);
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            clearInterval(interval);
        }
    }, 100);

    return () => clearInterval(interval);

  }, [currentStep, tourActive]);

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinish = () => {
    setTourActive(false);
    if(onTourComplete) onTourComplete();
  };
  
  if (!tourActive || !currentStep || !targetElement) {
    return null;
  }

  return (
    <Popover open={true}>
        <PopoverContent
            side={currentStep.side}
            align={currentStep.align}
            className="w-80 z-[101]"
            style={{
                position: 'fixed',
                top: `${popoverPosition.top + popoverPosition.height / 2}px`,
                left: `${popoverPosition.left + popoverPosition.width / 2}px`,
                transform: `translate(-50%, -50%)`, // Center on the element
            }}
            onInteractOutside={(e) => e.preventDefault()}
        >
            <div 
                style={{
                    position: 'absolute',
                    top: `calc(${popoverPosition.top}px - 10px)`,
                    left: `calc(${popoverPosition.left}px - 10px)`,
                    width: `calc(${popoverPosition.width}px + 20px)`,
                    height: `calc(${popoverPosition.height}px + 20px)`,
                    border: '3px solid hsl(var(--primary))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none',
                    zIndex: -1,
                }}
            />
            <div className="space-y-4">
                <h3 className="font-bold text-lg">{currentStep.title}</h3>
                <p className="text-sm text-muted-foreground">{currentStep.content}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                        Step {currentStepIndex + 1} of {tourSteps.length}
                    </span>
                    <div className="flex gap-2">
                        {currentStepIndex > 0 && (
                            <Button variant="ghost" size="sm" onClick={handlePrev}>
                                Previous
                            </Button>
                        )}
                        <Button size="sm" onClick={handleNext}>
                            {currentStepIndex === tourSteps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
                 <Button variant="link" size="sm" className="absolute top-2 right-2 p-0 h-auto" onClick={handleFinish}>
                    Skip
                </Button>
            </div>
        </PopoverContent>
    </Popover>
  );
}
