
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <HelpCircle className="h-6 w-6 text-primary" />
            Help & Information
          </DialogTitle>
          <DialogDescription>
            A quick guide to navigating and using the TripMapper app.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">What is TripMapper?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                TripMapper is a simple application designed to help you manually record and review your travel history. It's a straightforward way to keep track of your trips, distances, and travel purposes for transportation research.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">How do I add a trip?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                On the Dashboard, click "Start Trip" to begin recording. When your trip is finished, click "End Trip". A form will appear asking you to confirm details like the purpose and mode of transport before saving.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">Where can I see my trips?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                The "Dashboard" shows your most recent trips for the day. For a complete list of all your entries, please visit the "Trip History" page. Your travel statistics are available on the "Statistics" page.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
