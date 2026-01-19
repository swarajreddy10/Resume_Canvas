'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowPresent?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  allowPresent = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect(selectedDate);
    setOpen(false);
  };

  const handlePresentClick = () => {
    onSelect(undefined); // Use undefined to represent "Present"
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'MMM yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="bottom">
        <div className="p-3">
          {allowPresent && (
            <Button
              variant="outline"
              className="w-full mb-3"
              onClick={handlePresentClick}
            >
              Present
            </Button>
          )}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={(date) => date > new Date()}
            captionLayout="dropdown"
            fromYear={1990}
            toYear={new Date().getFullYear()}
            className="rounded-md border-0"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
