// Add at the top of the file
import { SEO } from '../../components/SEO';

// Add inside the AboutUs component, before the return statement
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Depo-Pro',
  description: 'Innovative legal deposition platform for court reporters, attorneys, videographers, and scopists.',
  url: 'https://depo-pro.com',
  logo: 'https://depo-pro.com/logo.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '7234 Hovingham',
    addressLocality: 'San Antonio',
    addressRegion: 'TX',
    postalCode: '78257',
    addressCountry: 'US'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-469-386-6065',
    contactType: 'customer service'
  },
  sameAs: [
    'https://twitter.com/DepoPro',
    'https://linkedin.com/company/depo-pro',
    'https://github.com/depo-pro'
  ]
};

// Add inside the return statement, before the first div
<SEO
  title="About Depo-Pro - Transforming Legal Technology"
  description="Learn about Depo-Pro's mission to modernize the legal industry with innovative deposition solutions for court reporters, attorneys, videographers, and scopists."
  keywords={[
    'legal tech company',
    'deposition platform',
    'legal innovation',
    'court reporting technology',
    'legal software company'
  ]}
  schema={schema}
  canonicalUrl="https://depo-pro.com/about"
/>