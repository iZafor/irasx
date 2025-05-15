"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface ComboBoxProps<T> {
    values: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
    name?: string;
    className?: string;
    isSelected?: (value: T) => boolean; // use this for multiple selection
}

export default function ComboBox<T>({
    value,
    onChange,
    values,
    name,
    className,
    isSelected,
}: ComboBoxProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? values.find((item) => item.value === value)?.label
                        : `Select ${name}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn("w-full p-0", className)}
                align="start"
            >
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {values.map((item) => (
                                <CommandItem
                                    key={item.label}
                                    value={item.label}
                                    onSelect={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            (
                                                isSelected
                                                    ? isSelected(item.value)
                                                    : value === item.value
                                            )
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
