// Add at the top of the file
import { SEO } from '../../components/SEO';

// Add inside the PrivacyPolicy component, before the return statement
const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  description: 'Depo-Pro\'s privacy policy explaining how we collect, use, and protect your information.',
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
  title="Privacy Policy"
  description="Learn how Depo-Pro protects your privacy and handles your information. Our comprehensive privacy policy covers data collection, usage, and security measures."
  keywords={[
    'legal software privacy',
    'data protection policy',
    'HIPAA compliance',
    'legal data security'
  ]}
  schema={schema}
  canonicalUrl="https://depo-pro.com/privacy"
  publishedDate="2025-02-15"
  modifiedDate="2025-02-15"
/>