"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = ({ children, open, onOpenChange }: {
    children: React.ReactNode,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}) => {
    const [isOpen, setIsOpen] = React.useState(open || false)

    React.useEffect(() => {
        if (open !== undefined) setIsOpen(open)
    }, [open])

    const toggle = (val: boolean) => {
        setIsOpen(val)
        onOpenChange?.(val)
    }

    return (
        <DialogContext.Provider value={{ isOpen, toggle }}>
            {children}
        </DialogContext.Provider>
    )
}

const DialogContext = React.createContext<{ isOpen: boolean, toggle: (val: boolean) => void }>({ isOpen: false, toggle: () => { } })

const DialogTrigger = ({ children, asChild, ...props }: any) => {
    const { toggle } = React.useContext(DialogContext)
    return React.cloneElement(children as React.ReactElement, {
        onClick: () => toggle(true),
        ...props
    })
}

const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const { isOpen, toggle } = React.useContext(DialogContext)
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => toggle(false)} />
            <div className={cn("relative z-50 w-full max-w-lg bg-white p-6 shadow-lg rounded-xl animate-in zoom-in-95 duration-200", className)}>
                {children}
                <button
                    onClick={() => toggle(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 outline-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    )
}

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
