import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  isRtl?: boolean;
}

/** Accessible breadcrumb navigation with aria-label and structured markup */
export default function Breadcrumb({ items, isRtl = false }: BreadcrumbProps) {
  return (
    <nav aria-label={isRtl ? "مسار التنقل" : "Breadcrumb"} className="mb-4">
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-sm text-[#64748b] ${isRtl ? "flex-row-reverse justify-end" : ""}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className={`w-3 h-3 shrink-0 text-[#94a3b8] ${isRtl ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast || !item.href ? (
                <span
                  className="text-[#0f172a] font-medium truncate max-w-[200px]"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#0EA5E9] transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
