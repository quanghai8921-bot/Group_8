"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }
>(({ className, onCheckedChange, ...props }, ref) => (
    <div className="relative flex items-center">
        <input
            type="checkbox"
            ref={ref}
            onChange={(e) => {
                props.onChange?.(e)
                onCheckedChange?.(e.target.checked)
            }}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                "appearance-none checked:bg-primary checked:border-primary",
                className
            )}
            {...props}
        />
        <Check
            className="absolute h-3 w-3 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5"
            strokeWidth={4}
        />
    </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
