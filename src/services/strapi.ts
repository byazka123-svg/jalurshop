import { Product, MOCK_PRODUCTS } from '../types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://api.jalur.shop';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products?populate=*`);
    if (!response.ok) throw new Error('Failed to fetch from Strapi');
    
    const json = await response.json();
    
    // Transform Strapi v4/v5 data structure to our Product interface
    // This assumes a standard Strapi response. Adjust based on your actual Strapi schema.
    return json.data.map((item: any) => {
      const attrs = item.attributes || item; // Handle both v4 and v5
      return {
        id: item.id.toString(),
        slug: attrs.slug || item.id.toString(),
        name: attrs.name,
        description: attrs.description,
        price: attrs.price || 0,
        category: attrs.category?.data?.attributes?.name || attrs.category || 'Uncategorized',
        image: attrs.image?.data?.attributes?.url 
          ? `${STRAPI_URL}${attrs.image.data.attributes.url}` 
          : attrs.image_url || 'https://picsum.photos/seed/placeholder/600/400',
        gallery: attrs.gallery?.data?.map((img: any) => `${STRAPI_URL}${img.attributes.url}`) || [],
        affiliateLink: attrs.affiliateLink,
        rating: attrs.rating || 5,
        longReview: attrs.longReview || '',
      };
    });
  } catch (error) {
    console.error('Strapi fetch error, falling back to mock data:', error);
    return MOCK_PRODUCTS;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Search by slug in Strapi
    const response = await fetch(`${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`);
    if (!response.ok) throw new Error('Failed to fetch product from Strapi');
    
    const json = await response.json();
    if (json.data.length === 0) return null;
    
    const item = json.data[0];
    const attrs = item.attributes || item;

    return {
      id: item.id.toString(),
      slug: attrs.slug || item.id.toString(),
      name: attrs.name,
      description: attrs.description,
      price: attrs.price || 0,
      category: attrs.category?.data?.attributes?.name || attrs.category || 'Uncategorized',
      image: attrs.image?.data?.attributes?.url 
        ? `${STRAPI_URL}${attrs.image.data.attributes.url}` 
        : attrs.image_url || 'https://picsum.photos/seed/placeholder/600/400',
      gallery: attrs.gallery?.data?.map((img: any) => `${STRAPI_URL}${img.attributes.url}`) || [],
      affiliateLink: attrs.affiliateLink,
      rating: attrs.rating || 5,
      longReview: attrs.longReview || '',
    };
  } catch (error) {
    console.error('Strapi fetch error for slug, falling back to mock data:', error);
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }
}
