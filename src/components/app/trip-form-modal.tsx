
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { tripPurposes, transportModes, type Trip, type TripPurpose, type TransportMode } from '@/lib/types';
import { getAiTripPurposeSuggestion } from '@/app/actions';
import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  purpose: z.enum(tripPurposes, { required_error: 'Please select a purpose.' }),
  mode: z.enum(transportModes, { required_error: 'Please select a mode of transport.' }),
  coTravellers: z.coerce.number().min(0, 'Must be a positive number.').int(),
});

type TripFormValues = z.infer<typeof formSchema>;

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: Omit<Trip, 'id'>) => void;
  tripData: Omit<Trip, 'id' | 'purpose' | 'coTravellers' | 'mode'>;
  allTrips: Trip[];
}

export default function TripFormModal({ isOpen, onClose, onSave, tripData, allTrips }: TripFormModalProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const form = useForm<TripFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: undefined,
      mode: 'vehicle', // Default simulation
      coTravellers: 0,
    },
  });

  const handleSuggestPurpose = async () => {
    setIsSuggesting(true);
    try {
      const { suggestedPurpose } = await getAiTripPurposeSuggestion(allTrips, tripData.endLocation);
      if (suggestedPurpose) {
        form.setValue('purpose', suggestedPurpose as TripPurpose, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Failed to get suggestion', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  function onSubmit(values: TripFormValues) {
    onSave({
      ...tripData,
      ...values,
    });
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Trip Details</DialogTitle>
          <DialogDescription>
            Your trip from {tripData.startLocation} to {tripData.endLocation} ({tripData.distance.toFixed(2)} miles) has ended. Please confirm the details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Trip</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tripPurposes.map(purpose => (
                          <SelectItem key={purpose} value={purpose} className="capitalize">
                            {purpose}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                     <Button type="button" variant="outline" size="icon" onClick={handleSuggestPurpose} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        <span className="sr-only">Suggest Purpose</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Transport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transportModes.map(mode => (
                        <SelectItem key={mode} value={mode} className="capitalize">
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coTravellers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-travellers</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="accent">Save Trip</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
