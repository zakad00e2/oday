interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Renders a JSON-LD <script> tag for structured data. Use in server components. */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
