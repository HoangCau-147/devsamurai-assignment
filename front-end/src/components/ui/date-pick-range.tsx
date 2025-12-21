import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPresetDays, setCustomRange } from "@/store/dateRangeSlice";

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

  const dispatch = useAppDispatch();
  const dateRange = useAppSelector((s) => s.dateRange);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { dateRange: { from: defaultFrom, to: defaultTo } },
  });

  useEffect(() => {
    // sync form with store
    if (dateRange.mode === "preset") {
      const to = new Date();
      const from = addDays(to, -dateRange.days);
      form.setValue("dateRange", { from, to });
    } else if (dateRange.mode === "custom" && dateRange.from && dateRange.to) {
      form.setValue("dateRange", {
        from: parseISO(dateRange.from),
        to: parseISO(dateRange.to),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.mode, dateRange.days, dateRange.from, dateRange.to]);

  const [open, setOpen] = useState(false);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(
      `Selected date range: From ${format(
        data.dateRange.from,
        "PPP"
      )} to ${format(data.dateRange.to, "PPP")}`
    );
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
                ? `${format(field.value.from, "LLL dd, y")} - ${format(
                    field.value.to,
                    "LLL dd, y"
                  )}`
                : format(field.value.from, "LLL dd, y")
              : "Pick a date";

            const presets = [
              { label: "1d", days: 1 },
              { label: "3d", days: 3 },
              { label: "7d", days: 7 },
              { label: "30d", days: 30 },
            ];

            const activeDays =
              dateRange.mode === "preset"
                ? dateRange.days
                : field.value?.from && field.value?.to
                ? differenceInDays(field.value.to, field.value.from)
                : null;

            function applyPreset(days: number) {
              const to = new Date();
              const from = addDays(to, -days);
              form.setValue(
                "dateRange",
                { from, to },
                { shouldDirty: true, shouldTouch: true }
              );
              dispatch(setPresetDays(days));
              setOpen(false);
            }

            return (
              <FormItem className="flex flex-col">
                <Popover open={open} onOpenChange={setOpen}>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 bg-transparent">
                      {presets.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => applyPreset(p.days)}
                          className={cn(
                            "px-2 py-3 text-sm hover:bg-neutral-100 hover:py-1 hover:rounded-md hover:border-0",
                            activeDays === p.days
                              ? "border-b border-solid border-black"
                              : "text-muted-foreground"
                          )}
                        >
                          {p.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className={cn(
                          "px-2 py-3 text-sm text-muted-foreground hover:bg-neutral-100 hover:py-1 hover:rounded-md",
                          open
                            ?? "border-b border-solid border-black"
                            )}
                      >
                        Custom
                      </button>
                    </div>

                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-3 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm text-white max-w-70",
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
                          if (val?.from && val?.to) {
                            dispatch(
                              setCustomRange({
                                from: val.from.toISOString(),
                                to: val.to.toISOString(),
                              })
                            );
                          }
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
