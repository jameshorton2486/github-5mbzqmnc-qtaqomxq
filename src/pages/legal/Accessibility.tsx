// Add at the top of the file
import { SEO } from '../../components/SEO';

// Add inside the Accessibility component, before the return statement
const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Accessibility Statement',
  description: 'Depo-Pro\'s commitment to digital accessibility and WCAG compliance.',
  publisher: {
    '@type': 'Organization',
    name: 'Depo-Pro',
    url: 'https://depo-pro.com'
  },
  datePublished: '2025-02-15',
  dateModified: '2025-02-15'
};

// Add inside the return statement, before the first div
<SEO
  title="Accessibility Statement"
  description="Learn about Depo-Pro's commitment to digital accessibility. Our platform follows WCAG guidelines to ensure access for all legal professionals."
  keywords={[
    'legal software accessibility',
    'WCAG compliance',
    'ADA compliant software',
    'accessible legal platform'
  ]}
  schema={schema}
  canonicalUrl="https://depo-pro.com/accessibility"
  publishedDate="2025-02-15"
  modifiedDate="2025-02-15"
/>