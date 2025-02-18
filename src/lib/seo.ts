import { type Route } from 'react-router-dom';

interface SEOMetadata {
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

export const routes: Record<string, SEOMetadata> = {
  '/': {
    title: 'Depo-Pro - AI-Powered Legal Deposition Platform',
    description: 'Transform your legal deposition workflow with AI-powered transcription, digital exhibits, and secure collaboration. Industry-leading accuracy for court reporters, attorneys, videographers, and scopists.',
    keywords: ['legal deposition software', 'AI transcription', 'court reporting', 'digital exhibits', 'legal technology'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Depo-Pro',
      'applicationCategory': 'LegalService',
      'description': 'AI-powered legal deposition platform for court reporters, attorneys, videographers, and scopists',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '99',
        'priceCurrency': 'USD'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '156'
      }
    }
  },
  '/for-attorneys': {
    title: 'Legal Deposition Software for Attorneys | Digital Exhibit Management | Depo-Pro',
    description: 'Streamline your deposition workflow with AI-powered exhibit management, real-time collaboration, and secure digital presentation tools. Built for modern legal professionals.',
    keywords: ['digital exhibits', 'legal presentation tools', 'deposition software', 'attorney technology', 'legal document management'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'applicationCategory': 'LegalService',
      'name': 'Depo-Pro for Attorneys',
      'description': 'Digital exhibit management and presentation tools for legal professionals',
      'features': [
        'Real-time exhibit sharing',
        'Digital document management',
        'Secure collaboration',
        'AI-powered assistance',
        'Video integration'
      ]
    }
  },
  '/for-court-reporters': {
    title: 'AI-Powered Transcription Software for Court Reporters | Depo-Pro',
    description: 'Achieve 99.9% accuracy with AI-assisted transcription, real-time editing, and advanced audio synchronization. Built by court reporters, for court reporters.',
    keywords: ['court reporter software', 'legal transcription', 'AI transcription', 'real-time editing', 'audio sync'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'applicationCategory': 'BusinessApplication',
      'name': 'Depo-Pro for Court Reporters',
      'description': 'AI-powered transcription and editing tools for court reporters',
      'features': [
        'Real-time transcription',
        'AI-powered assistance',
        'Audio synchronization',
        'Cloud storage',
        'Collaboration tools'
      ]
    }
  },
  '/for-videographers': {
    title: 'Legal Videography Software | Video Synchronization Tools | Depo-Pro',
    description: 'Professional-grade video synchronization, cloud storage, and collaboration tools for legal videographers. Streamline your workflow with advanced AI technology.',
    keywords: ['legal videography', 'video synchronization', 'deposition video', 'cloud storage', 'legal technology'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'applicationCategory': 'VideoApplication',
      'name': 'Depo-Pro for Videographers',
      'description': 'Professional video tools for legal videographers'
    }
  },
  '/for-scopists': {
    title: 'Scoping Software | Transcript Editing Tools | Depo-Pro',
    description: 'Advanced transcript editing tools with built-in reference materials, version control, and seamless court reporter collaboration. Designed for professional scopists.',
    keywords: ['scoping software', 'transcript editing', 'court reporter collaboration', 'legal reference', 'proofreading tools'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'applicationCategory': 'BusinessApplication',
      'name': 'Depo-Pro for Scopists',
      'description': 'Professional transcript editing tools for scopists'
    }
  },
  '/blog': {
    title: 'Legal Technology Blog | Deposition Tips & Best Practices | Depo-Pro',
    description: 'Expert insights on legal technology, deposition best practices, and industry trends. Written by legal professionals for legal professionals.',
    keywords: ['legal technology blog', 'deposition tips', 'court reporting', 'legal tech news', 'industry insights'],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'Depo-Pro Blog',
      'description': 'Expert insights on legal technology and depositions'
    }
  }
};

export function updateMetaTags(metadata: SEOMetadata): void {
  // Update title with brand suffix if not present
  const brandSuffix = '| Depo-Pro';
  const title = metadata.title.includes(brandSuffix) ? metadata.title : `${metadata.title} ${brandSuffix}`;
  document.title = title;
  
  // Update meta tags
  const metaTags = {
    'description': metadata.description,
    'keywords': metadata.keywords?.join(', '),
    'author': metadata.author || 'Depo-Pro',
    'robots': 'index, follow',
    'viewport': 'width=device-width, initial-scale=1'
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    if (!content) return;
    
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // Update canonical URL
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', metadata.canonicalUrl || window.location.href);

  // Update Open Graph tags
  updateOpenGraphTags(metadata);

  // Update Schema.org markup
  if (metadata.schema) {
    updateSchemaMarkup(metadata.schema);
  }

  // Update article metadata if available
  if (metadata.publishedDate || metadata.modifiedDate) {
    updateArticleMetadata(metadata);
  }
}

function updateOpenGraphTags(metadata: SEOMetadata): void {
  const ogTags = {
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:url': metadata.canonicalUrl || window.location.href,
    'og:image': metadata.ogImage || 'https://depo-pro.com/og-image.jpg',
    'og:type': 'website',
    'og:site_name': 'Depo-Pro',
    'twitter:card': 'summary_large_image',
    'twitter:site': '@DepoPro',
    'twitter:creator': '@DepoPro'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });
}

function updateSchemaMarkup(schema: object): void {
  let scriptTag = document.querySelector('script[type="application/ld+json"]');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(schema);
}

function updateArticleMetadata(metadata: SEOMetadata): void {
  if (metadata.publishedDate) {
    let publishedTag = document.querySelector('meta[property="article:published_time"]');
    if (!publishedTag) {
      publishedTag = document.createElement('meta');
      publishedTag.setAttribute('property', 'article:published_time');
      document.head.appendChild(publishedTag);
    }
    publishedTag.setAttribute('content', metadata.publishedDate);
  }

  if (metadata.modifiedDate) {
    let modifiedTag = document.querySelector('meta[property="article:modified_time"]');
    if (!modifiedTag) {
      modifiedTag = document.createElement('meta');
      modifiedTag.setAttribute('property', 'article:modified_time');
      document.head.appendChild(modifiedTag);
    }
    modifiedTag.setAttribute('content', metadata.modifiedDate);
  }
}