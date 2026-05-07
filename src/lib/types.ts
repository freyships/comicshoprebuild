export interface BusinessHoursEntry {
  day: string;
  open: string;
  close: string;
}

export interface Listing {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  street_address: string | null;
  city: string;
  city_slug: string;
  state: string;
  state_slug: string;
  country: string;
  country_slug: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  business_hours: BusinessHoursEntry[] | null;
  featured_image_url: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}
