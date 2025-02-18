// Add at the top of the file
import { SEO } from '../../components/SEO';

// Add inside the TermsOfService component, before the return statement
const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description: 'Terms and conditions for using the Depo-Pro platform.',
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
  title="Terms of Service"
  description="Read Depo-Pro's terms of service. Understand your rights and responsibilities when using our legal deposition platform."
  keywords={[
    'legal software terms',
    'deposition platform terms',
    'service agreement',
    'legal terms conditions'
  ]}
  schema={schema}
  canonicalUrl="https://depo-pro.com/terms"
  publishedDate="2025-02-15"
  modifiedDate="2025-02-15"
/>