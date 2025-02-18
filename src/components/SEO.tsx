import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  schema?: object;
  keywords?: string[];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://depo-pro.com/og-image.jpg',
  schema,
  keywords = [],
  author = 'Depo-Pro',
  publishedDate,
  modifiedDate
}: SEOProps) {
  const defaultKeywords = [
    'legal deposition software',
    'court reporter tools',
    'legal videography software',
    'scopist platform',
    'deposition management',
    'legal technology'
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');
  const fullTitle = `${title} | Depo-Pro`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Depo-Pro" />
      {canonicalUrl && (
        <>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:url" content={canonicalUrl} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article Meta (if applicable) */}
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}