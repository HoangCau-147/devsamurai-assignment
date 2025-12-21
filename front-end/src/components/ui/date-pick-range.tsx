import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addDays, differenceInDays } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
 
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
 
const FormSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "A start date is required.",
    }),
    to: z.date({
      required_error: "An end date is required.",
    }),
  }),
});
 
export function DatePickerWithRangeForm() {
  const defaultTo = new Date();
  const defaultFrom = addDays(defaultTo, -30);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { dateRange: { from: defaultFrom, to: defaultTo } },
  });

  const [open, setOpen] = useState(false);
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(`Selected date range: From ${format(data.dateRange.from, "PPP")} to ${format(data.dateRange.to, "PPP")}`);
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => {
            const leftLabel = field.value?.from
              ? field.value.to
                ? `${format(field.value.from, "LLL dd, y")} - ${format(field.value.to, "LLL dd, y")}`
                : format(field.value.from, "LLL dd, y")
              : "Pick a date";

            const presets = [
              { label: "1d", days: 1 },
              { label: "3d", days: 3 },
              { label: "7d", days: 7 },
              { label: "30d", days: 30 },
            ];

            const activeDays = field.value?.from && field.value?.to ? differenceInDays(field.value.to, field.value.from) : null;

            function applyPreset(days: number) {
              const to = new Date();
              const from = addDays(to, -days);
              form.setValue("dateRange", { from, to }, { shouldDirty: true, shouldTouch: true });
              setOpen(false);
            }

            return (
              <FormItem className="flex flex-col">
                <Popover open={open} onOpenChange={setOpen}>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-md bg-transparent p-1">
                      {presets.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => applyPreset(p.days)}
                          className={cn(
                            "rounded-md px-2 py-1 text-sm",
                            activeDays === p.days
                              ? "bg-neutral-700 text-white"
                              : "text-muted-foreground hover:bg-neutral-800"
                          )}
                        >
                          {p.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className={cn(
                          "rounded-md px-2 py-1 text-sm",
                          open ? "bg-neutral-700 text-white" : "text-muted-foreground hover:bg-neutral-800"
                        )}
                      >
                        Custom
                      </button>
                    </div>

                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-3 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm text-white max-w-[280px]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <div className="inline-flex items-center justify-center bg-neutral-800 rounded-sm p-1">
                          <CalendarIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="truncate">{leftLabel}</span>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={(val) => {
                          field.onChange(val);
                          setOpen(false);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </div>
                </Popover>

                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}