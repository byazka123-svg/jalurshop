export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  gallery: string[];
  affiliateLink: string;
  rating: number;
  longReview: string;
}

export const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Gadgets'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'wireless-noise-cancelling-headphones',
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium sound quality with active noise cancellation for an immersive listening experience. Perfect for travel, work, and everything in between.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/headphones/600/400',
    gallery: [
      'https://picsum.photos/seed/hp1/600/400',
      'https://picsum.photos/seed/hp2/600/400',
      'https://picsum.photos/seed/hp3/600/400'
    ],
    affiliateLink: 'https://example.com/affiliate/1',
    rating: 4.8,
    longReview: `
## Mengapa Headphone Ini Layak Dimiliki?

Setelah mencoba headphone ini selama dua minggu, saya bisa menyimpulkan bahwa ini adalah salah satu investasi terbaik untuk produktivitas dan hiburan Anda. Fitur **Active Noise Cancellation (ANC)** yang ditawarkan benar-benar mampu meredam suara bising di sekitar, mulai dari suara mesin pesawat hingga percakapan di kafe yang ramai.

### Kualitas Suara yang Memukau
Driver audio yang digunakan memberikan respon bass yang dalam namun tetap terkontrol, sementara nada tinggi terdengar jernih tanpa menusuk telinga. Sangat cocok untuk mendengarkan berbagai genre musik, dari jazz hingga EDM.

### Kenyamanan Sepanjang Hari
Earpads yang empuk dengan bahan premium membuat headphone ini tidak terasa berat atau menekan telinga, bahkan setelah digunakan selama 4 jam berturut-turut.

### Kesimpulan
Jika Anda mencari kualitas suara premium dan ketenangan di mana saja, produk ini adalah jawabannya. Meskipun harganya lumayan, kualitas yang didapat sangat sebanding.
    `
  },
  {
    id: '2',
    slug: 'smart-watch-series-7',
    name: 'Smart Watch Series 7',
    description: 'Track your fitness, heart rate, and stay connected with this sleek smart watch. Featuring an always-on Retina display.',
    price: 399.00,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/smartwatch/600/400',
    gallery: [
      'https://picsum.photos/seed/sw1/600/400',
      'https://picsum.photos/seed/sw2/600/400'
    ],
    affiliateLink: 'https://example.com/affiliate/2',
    rating: 4.6,
    longReview: `
## Pendamping Kesehatan di Pergelangan Tangan Anda

Smartwatch ini bukan sekadar jam tangan digital biasa. Ini adalah asisten pribadi yang memantau kesehatan Anda 24/7.

### Layar yang Lebih Luas dan Terang
Dibandingkan generasi sebelumnya, layar Series 7 terasa jauh lebih lega. Mengetik pesan atau melihat notifikasi menjadi jauh lebih mudah berkat bezel yang semakin tipis.

### Fitur Kesehatan Terlengkap
Mulai dari pemantauan detak jantung, kadar oksigen dalam darah (SpO2), hingga fitur EKG. Semuanya bisa diakses hanya dengan beberapa ketukan.

### Daya Tahan Baterai
Meskipun fiturnya sangat banyak, baterainya mampu bertahan seharian penuh dengan pengisian daya yang sangat cepat. Hanya butuh waktu sekitar 45 menit untuk mengisi dari 0 ke 80%.
    `
  },
  {
    id: '3',
    slug: 'minimalist-leather-wallet',
    name: 'Minimalist Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID blocking technology. Slim design fits perfectly in your pocket.',
    price: 45.00,
    category: 'Fashion',
    image: 'https://picsum.photos/seed/wallet/600/400',
    gallery: [
      'https://picsum.photos/seed/w1/600/400',
      'https://picsum.photos/seed/w2/600/400'
    ],
    affiliateLink: 'https://example.com/affiliate/3',
    rating: 4.9,
    longReview: `
## Dompet Kulit Minimalis: Elegan dan Aman

Di zaman sekarang, dompet tebal sudah tidak lagi relevan. Dompet minimalis ini hadir sebagai solusi bagi Anda yang ingin tampil rapi tanpa mengorbankan fungsionalitas.

### Material Kulit Asli Berkualitas
Begitu memegang dompet ini, Anda akan langsung merasakan kualitas kulit aslinya. Teksturnya lembut dan aromanya khas kulit premium yang akan semakin bagus seiring berjalannya waktu (*patina*).

### Keamanan RFID Blocking
Jangan khawatir data kartu kredit Anda dicuri secara nirkabel. Dompet ini sudah dilengkapi lapisan pelindung RFID yang sangat efektif.

### Kapasitas yang Pas
Meskipun sangat tipis, dompet ini mampu menampung hingga 8 kartu dan beberapa lembar uang kertas tanpa terlihat menggembung.
    `
  },
  {
    id: '4',
    slug: 'portable-espresso-maker',
    name: 'Portable Espresso Maker',
    description: 'Enjoy your favorite coffee anywhere with this compact and easy-to-use espresso maker. No battery or electricity needed.',
    price: 89.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/coffee/600/400',
    gallery: [
      'https://picsum.photos/seed/c1/600/400',
      'https://picsum.photos/seed/c2/600/400'
    ],
    affiliateLink: 'https://example.com/affiliate/4',
    rating: 4.5,
    longReview: `
## Kopi Espresso Berkualitas di Mana Saja

Bagi pecinta kopi, tidak ada yang lebih nikmat daripada segelas espresso di pagi hari, bahkan saat sedang berada di tengah hutan atau di puncak gunung.

### Desain Portabel yang Tangguh
Alat ini sangat ringan dan ringkas. Bisa masuk ke dalam tas ransel tanpa memakan banyak tempat. Material plastiknya sangat kokoh dan tahan panas.

### Cara Penggunaan yang Mudah
Cukup masukkan bubuk kopi favorit Anda, tambahkan air panas, dan pompa secara manual. Tekanan yang dihasilkan sangat stabil, menghasilkan *crema* yang tebal dan kaya rasa.

### Tanpa Listrik, Tanpa Masalah
Inilah keunggulan utamanya. Anda tidak butuh baterai atau colokan listrik. Benar-benar alat yang wajib dimiliki oleh para petualang yang juga pecinta kopi.
    `
  }
];
