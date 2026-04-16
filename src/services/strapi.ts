import { Product, MOCK_PRODUCTS } from '../types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://api.jalur.shop';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/products?populate=*`);
    if (!response.ok) throw new Error('Failed to fetch from Strapi');
    
    const json = await response.json();
    
    // Transform Strapi v4/v5 data structure to our Product interface
    return json.data.map((item: any) => {
      const attrs = item.attributes || item; // Handle both v4 and v5
      
      // Robust category name extraction
      let categoryName = 'Uncategorized';
      const cat = attrs.category || attrs.categories; // Support both singular and plural
      if (cat) {
        // Handle Strapi's nested data structure
        const catData = Array.isArray(cat.data) ? cat.data[0] : cat.data;
        const target = catData || cat; // Fallback to cat if no data wrapper
        
        if (typeof target === 'string') {
          categoryName = target;
        } else if (target) {
          // Check various common field names for category name
          const possibleName = (target.attributes ? target.attributes.name : null) || 
                               target.name || 
                               target.title || 
                               (target.attributes ? target.attributes.title : null);
          if (possibleName) categoryName = possibleName;
        }
      }

      // Robust image extraction
      let imageUrl = attrs.image_url || 'https://picsum.photos/seed/placeholder/600/400';
      const imgData = attrs.image?.data?.attributes || attrs.image?.attributes || attrs.image?.data || attrs.image;
      if (imgData && imgData.url) {
        imageUrl = imgData.url.startsWith('http') ? imgData.url : `${STRAPI_URL}${imgData.url}`;
      }

      // Robust gallery extraction
      let galleryUrls: string[] = [];
      const galleryData = attrs.gallery?.data || attrs.gallery;
      if (Array.isArray(galleryData)) {
        galleryUrls = galleryData.map((img: any) => {
          const iData = img.attributes || img;
          if (iData.url) {
            return iData.url.startsWith('http') ? iData.url : `${STRAPI_URL}${iData.url}`;
          }
          return '';
        }).filter(url => url !== '');
      }

      return {
        id: item.id.toString(),
        slug: attrs.slug || item.id.toString(),
        name: attrs.name,
        description: attrs.description,
        price: attrs.price || 0,
        category: categoryName,
        image: imageUrl,
        gallery: galleryUrls,
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

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories from Strapi');
    
    const json = await response.json();
    const categories = json.data.map((item: any) => {
      const attrs = item.attributes || item;
      return attrs.name;
    });
    
    return ['All', ...categories];
  } catch (error) {
    console.error('Strapi categories fetch error:', error);
    return ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Gadgets'];
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

    // Robust category name extraction
    let categoryName = 'Uncategorized';
    const cat = attrs.category || attrs.categories; // Support both singular and plural
    if (cat) {
      // Handle Strapi's nested data structure
      const catData = Array.isArray(cat.data) ? cat.data[0] : cat.data;
      const target = catData || cat; // Fallback to cat if no data wrapper
      
      if (typeof target === 'string') {
        categoryName = target;
      } else if (target) {
        // Check various common field names for category name
        const possibleName = (target.attributes ? target.attributes.name : null) || 
                             target.name || 
                             target.title || 
                             (target.attributes ? target.attributes.title : null);
        if (possibleName) categoryName = possibleName;
      }
    }

    // Robust image extraction
    let imageUrl = attrs.image_url || 'https://picsum.photos/seed/placeholder/600/400';
    const imgData = attrs.image?.data?.attributes || attrs.image?.attributes || attrs.image?.data || attrs.image;
    if (imgData && imgData.url) {
      imageUrl = imgData.url.startsWith('http') ? imgData.url : `${STRAPI_URL}${imgData.url}`;
    }

    // Robust gallery extraction
    let galleryUrls: string[] = [];
    const galleryData = attrs.gallery?.data || attrs.gallery;
    if (Array.isArray(galleryData)) {
      galleryUrls = galleryData.map((img: any) => {
        const iData = img.attributes || img;
        if (iData.url) {
          return iData.url.startsWith('http') ? iData.url : `${STRAPI_URL}${iData.url}`;
        }
        return '';
      }).filter(url => url !== '');
    }

    return {
      id: item.id.toString(),
      slug: attrs.slug || item.id.toString(),
      name: attrs.name,
      description: attrs.description,
      price: attrs.price || 0,
      category: categoryName,
      image: imageUrl,
      gallery: galleryUrls,
      affiliateLink: attrs.affiliateLink,
      rating: attrs.rating || 5,
      longReview: attrs.longReview || '',
    };
  } catch (error) {
    console.error('Strapi fetch error for slug, falling back to mock data:', error);
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  }
}
