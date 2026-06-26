export interface Employer {
  id: string;
  slug: string;
  name: string;
  /** Path under /employers, e.g. "/employers/bupa.svg". */
  logo: string;
  industry: string;
  tagline: string;
  about: string;
  /** Headquarters / primary location label. */
  location: string;
  /** Approximate headcount label, e.g. "1,000+ employees". */
  size: string;
  /** Average review score out of 5 (demo metric). */
  rating: number;
  reviewCount: number;
}
