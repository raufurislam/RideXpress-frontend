import * as React from "react";
import { cn } from "@/lib/utils";

export function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn("list-none", className)} {...props} />;
}

export function PaginationLink({
  className,
  isActive,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border px-3 text-sm",
        "bg-background hover:bg-accent hover:text-accent-foreground",
        isActive &&
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      {...props}
    />
  );
}

export function PaginationPrevious(
  props: React.ComponentProps<typeof PaginationLink>
) {
  return <PaginationLink aria-label="Go to previous page" {...props} />;
}

export function PaginationNext(
  props: React.ComponentProps<typeof PaginationLink>
) {
  return <PaginationLink aria-label="Go to next page" {...props} />;
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center px-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      …
    </span>
  );
}
