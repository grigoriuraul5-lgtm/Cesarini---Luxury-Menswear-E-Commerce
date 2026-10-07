/** Injectează JSON-LD server-side (apare în HTML-ul inițial, citibil de crawlere fără JS). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape `<` ca să nu poată închide tag-ul script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
