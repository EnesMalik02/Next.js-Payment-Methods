export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    imageUrl?: string; // Checkout sayfasında kullanmak için görsel URL'i ekleyelim.
  }
  
  export const products: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 1,
      category: 'Elektronik',
      description: 'Apple iPhone 15 Pro 128GB Doğal Titanyum',
      imageUrl: "https://placehold.co/100x100/333/white?text=iPhone&font=raleway",
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      price: 2,
      category: 'Elektronik',
      description: 'Samsung Galaxy S24 256GB Siyah',
      imageUrl: "https://placehold.co/100x100/222/white?text=Galaxy&font=raleway",
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      price: 3,
      category: 'Bilgisayar',
      description: 'Apple MacBook Air 13" M3 Çip 8GB RAM 256GB SSD',
      imageUrl: "https://placehold.co/100x100/444/white?text=MacBook&font=raleway",
    }
  ];
  
  // Belirli bir ID'ye göre ürünü bulan bir yardımcı fonksiyon
  export const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  export const getPriceById = (id: number): number => {
    return products.find(product => product.id === id)?.price || 0;
  };