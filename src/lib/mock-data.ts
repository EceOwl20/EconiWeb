import { pickSampleImageSet } from "@/lib/sample-images";
import { pickSampleAdvisorImage } from "@/lib/sample-advisor-images";
import type { Advisor, BlogPost, Property, User } from "@/lib/types";

const imageSet0 = pickSampleImageSet(0);
const imageSet1 = pickSampleImageSet(1);
const imageSet2 = pickSampleImageSet(2);
const imageSet3 = pickSampleImageSet(3);
const imageSet4 = pickSampleImageSet(4);
const imageSet5 = pickSampleImageSet(5);

export const initialAdvisors: Advisor[] = [
  {
    id: "adv-1",
    name: "Ayşe Demir",
    title: "Kıdemli Konut Danışmanı",
    phone: "+90 532 111 22 33",
    whatsapp: "+905321112233",
    email: "ayse.demir@econiinvest.com",
    focusArea: "Kadıköy / Moda",
    image: pickSampleAdvisorImage(0),
  },
  {
    id: "adv-2",
    name: "Mehmet Kaya",
    title: "Yatırım Uzmanı",
    phone: "+90 533 444 55 66",
    whatsapp: "+905334445566",
    email: "mehmet.kaya@econiinvest.com",
    focusArea: "Beşiktaş / Levent",
    image: pickSampleAdvisorImage(1),
  },
  {
    id: "adv-3",
    name: "Selin Yıldız",
    title: "Lüks Portföy Danışmanı",
    phone: "+90 534 777 88 99",
    whatsapp: "+905347778899",
    email: "selin.yildiz@econiinvest.com",
    focusArea: "Sarıyer / Zekeriyaköy",
    image: pickSampleAdvisorImage(2),
  },
];

export const initialUsers: User[] = [
  {
    id: "usr-portal-1",
    name: "Oguz Kilinc",
    role: "portal_admin",
    email: "oguzkilinc.ant@gmail.com",
    phone: "+90 555 000 00 00",
    username: "oguzkilinc.ant@gmail.com",
    password: "qweasd11.",
  },
  {
    id: "usr-1",
    name: "Operasyon Admin",
    role: "admin",
    email: "operasyon@econiinvest.com",
    phone: "+90 212 900 00 01",
    username: "admin",
    password: "admin123",
  },
  {
    id: "usr-admin-demo",
    name: "Sistem Admin",
    role: "admin",
    email: "admin@admin",
    phone: "+90 555 111 11 11",
    username: "admin@admin",
    password: "admin",
  },
  {
    id: "usr-2",
    name: "Ayşe Demir",
    role: "portfolio_manager",
    email: "ayse.demir@econiinvest.com",
    phone: "+90 532 111 22 33",
    username: "ayse",
    password: "ayse123",
    advisorId: "adv-1",
  },
  {
    id: "usr-3",
    name: "İçerik Editörü",
    role: "editor",
    email: "icerik@econiinvest.com",
    phone: "+90 212 900 00 03",
    username: "icerik",
    password: "icerik123",
  },
];

export const initialProperties: Property[] = [
  {
    id: "prp-1",
    slug: "modada-deniz-manzarali-4-1-daire",
    title: "Moda'da Deniz Manzaralı 4+1 Daire",
    city: "İstanbul",
    district: "Kadıköy",
    neighborhood: "Caferağa",
    type: "Daire",
    price: 23500000,
    rooms: "4+1",
    areaM2: 210,
    floor: "6 / 8",
    heating: "Kombi",
    listingRef: "PN-0001",
    description:
      "Bağdat Caddesi'ne yürüme mesafesinde, deniz manzarası ve geniş yaşam alanlarıyla aile kullanımı ve uzun vadeli değer koruması için güçlü bir portföy.",
    highlights: [
      "Deniz manzarası",
      "Kapalı otopark",
      "Asansör",
      "Yatırıma uygun lokasyon",
    ],
    features: [
      "Akıllı ev altyapısı",
      "Ebeveyn banyosu",
      "Geniş balkon",
      "Yerden ısıtma",
      "7/24 güvenlik",
    ],
    advisorId: "adv-1",
    latitude: 40.9886,
    longitude: 29.029,
    coverColor: "linear-gradient(120deg, #0f766e, #2dd4bf)",
    coverImage: imageSet0.cover,
    galleryImages: imageSet0.gallery,
    imageLabels: ["Salon", "Mutfak", "Ebeveyn Odası"],
    publishedAt: "2026-03-12T10:30:00.000Z",
  },
  {
    id: "prp-2",
    slug: "leventte-kira-getirili-ofis-kati",
    title: "Levent'te Kira Getirili Ofis Katı",
    city: "İstanbul",
    district: "Beşiktaş",
    neighborhood: "Levent",
    type: "Ofis",
    price: 18900000,
    rooms: "Açık Plan",
    areaM2: 175,
    floor: "5 / 12",
    heating: "Merkezi",
    listingRef: "PN-0002",
    description:
      "Kurumsal kiracı yapısı, merkezi erişim avantajı ve düzenli gelir potansiyeliyle öne çıkan A sınıfı ofis yatırımı.",
    highlights: [
      "Hazır kiracılı",
      "Yüksek kira geliri",
      "Merkezi konum",
      "A sınıfı bina",
    ],
    features: [
      "Kartlı geçiş",
      "Açık otopark",
      "Merkezi iklimlendirme",
      "Toplantı odası",
    ],
    advisorId: "adv-2",
    latitude: 41.0782,
    longitude: 29.0113,
    coverColor: "linear-gradient(120deg, #1d1d1b, #66a557)",
    coverImage: imageSet3.cover,
    galleryImages: imageSet3.gallery,
    imageLabels: ["Cephe", "Çalışma Alanı", "Lobi"],
    publishedAt: "2026-03-11T08:00:00.000Z",
  },
  {
    id: "prp-3",
    slug: "zekeriyakoyde-bahceli-luks-villa",
    title: "Zekeriyaköy'de Bahçeli Lüks Villa",
    city: "İstanbul",
    district: "Sarıyer",
    neighborhood: "Zekeriyaköy",
    type: "Villa",
    price: 42500000,
    rooms: "6+2",
    areaM2: 480,
    floor: "Müstakil",
    heating: "Yerden Isıtma",
    listingRef: "PN-0003",
    description:
      "Güvenlikli site içinde, bağımsız bahçe ve özel havuz avantajıyla konumlanan, yüksek yaşam standardı sunan anahtar teslim aile villası.",
    highlights: [
      "Özel havuz",
      "Müstakil bahçe",
      "Kapalı garaj",
      "Site güvenliği",
    ],
    features: [
      "Akıllı ev sistemi",
      "Şömine",
      "Yardımcı odası",
      "Sinema odası",
      "Fitness alanı",
    ],
    advisorId: "adv-3",
    latitude: 41.2024,
    longitude: 29.0306,
    coverColor: "linear-gradient(120deg, #7c2d12, #fb923c)",
    coverImage: imageSet2.cover,
    galleryImages: imageSet2.gallery,
    imageLabels: ["Bahçe", "Salon", "Havuz"],
    publishedAt: "2026-03-10T14:15:00.000Z",
  },
  {
    id: "prp-4",
    slug: "nisantasinda-yuksek-kat-rezidans",
    title: "Nişantaşı'nda Yüksek Kat Rezidans",
    city: "İstanbul",
    district: "Şişli",
    neighborhood: "Harbiye",
    type: "Rezidans",
    price: 31800000,
    rooms: "3+1",
    areaM2: 190,
    floor: "22 / 30",
    heating: "Merkezi",
    listingRef: "PN-0004",
    description:
      "Concierge, vale ve sosyal tesis imkanlarıyla şehir merkezinde prestijli yaşam ve güçlü kiralama potansiyeli sunan rezidans.",
    highlights: ["Panoramik şehir manzarası", "Vale", "Concierge", "Sosyal tesis"],
    features: [
      "Kapalı havuz",
      "Spa",
      "Çocuk oyun alanı",
      "Kuru temizleme hizmeti",
    ],
    advisorId: "adv-2",
    latitude: 41.0486,
    longitude: 28.9886,
    coverColor: "linear-gradient(120deg, #7e22ce, #c084fc)",
    coverImage: imageSet1.cover,
    galleryImages: imageSet1.gallery,
    imageLabels: ["Salon", "Mutfak", "Teras"],
    publishedAt: "2026-03-09T11:45:00.000Z",
  },
  {
    id: "prp-5",
    slug: "izmir-urla-yatirimlik-imarli-arsa",
    title: "İzmir Urla'da Yatırımlık İmarlı Arsa",
    city: "İzmir",
    district: "Urla",
    neighborhood: "Gülbahçe",
    type: "Arsa",
    price: 9700000,
    rooms: "-",
    areaM2: 920,
    floor: "-",
    heating: "-",
    listingRef: "PN-0005",
    description:
      "Ana yola cepheli, villa imarlı ve gelişim aksı üzerinde konumlanan; uzun vadeli değer artışı potansiyeli taşıyan yatırım arsası.",
    highlights: [
      "Villa imarı",
      "Ana yola cephe",
      "Tapu hazır",
      "Hızlı satış imkanı",
    ],
    features: [
      "Elektrik altyapısı",
      "Su bağlantısı",
      "Kadastral yol",
      "Bölge gelişim planı",
    ],
    advisorId: "adv-1",
    latitude: 38.3706,
    longitude: 26.762,
    coverColor: "linear-gradient(120deg, #166534, #4ade80)",
    coverImage: imageSet4.cover,
    galleryImages: imageSet4.gallery,
    imageLabels: ["Arazi Görünümü", "Yol Cephesi", "Bölge Planı"],
    publishedAt: "2026-03-08T09:20:00.000Z",
  },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-seo-showcase-2026",
    slug: "premium-emlak-ilaninda-seo-ve-satis-stratejisi-rehberi",
    title: "Premium Portföy Sunumunda SEO ve Satış Stratejisi",
    excerpt:
      "Premium segmentte nitelikli talep toplamak için güçlü görsel kadar doğru başlık, içerik akışı ve danışmana yönlendiren net aksiyonlar da kritik rol oynar.",
    content: `H2|accent: Premium Portföy Sunumunda SEO Neden Satış Kalitesini Artırır

P: Premium segmentte alıcı davranışı, ilk temasta güven veren ve net bilgi sunan portföylere yönelir. Bu nedenle SEO kurgusu yalnızca görünürlük değil, teklif kalitesi ve danışman iletişimi açısından da belirleyici bir etkendir.

H3|soft: İlk 7 günde görünürlük için temel sinyaller

UL|soft: Başlıkta lokasyon ve portföy tipini birlikte kullanın | Meta açıklamasında net değer önermesi yazın | Etiketlerde semt, yatırım ve satış niyetini birlikte konumlandırın | İlk paragrafta fiyat bandı ve hedef alıcı profilini belirtin

H4|accent: İçerik akışının dönüşüme etkisi

OL: Arama niyetini karşılayan güçlü bir giriş yazın | Lokasyon avantajlarını ulaşım, sosyal imkan ve talep verisiyle açıklayın | Fiyat/değer dengesini benzer portföy mantığıyla sunun | Uzman yorumu ve güven sinyalleriyle karar sürecini hızlandırın

QUOTE|accent: Premium segmentte yalnızca iyi görsel değil, doğru kurgulanmış metin de teklif kalitesini belirler.

IMG|soft: https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80 | Boğaz manzaralı premium rezidans salonu | Açıklayıcı görsel başlıkları, arama trafiğinden gelen kullanıcı kalitesini artırır.

H5: İç bağlantı ve harita stratejisi

P|soft: Blog içeriğinden ilgili portföy sayfalarına, bölgesel kategoriye ve harita üzerindeki ilanlara bağlantı vermek; kullanıcının sitede geçirdiği süreyi artırır ve dönüşüm hunisini güçlendirir.

IMG: https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80 | İstanbul sahil hattında lüks daire dış cephesi | Bölgesel anahtar kelimeyle yazılmış alt metin, sayfanın konu alakasını güçlendirir.

CTA|accent: Danışmanla Portföy Stratejisi Planla | /iletisim`,
    coverImage: imageSet1.cover,
    authorName: "Econi Invest İçerik Ekibi",
    tags: ["Premium Portföy", "SEO", "Satış Stratejisi", "İçerik Pazarlaması", "İstanbul"],
    metaTitle: "Premium Portföy Sunumunda SEO ve Satış Stratejisi | Econi Invest",
    metaDescription:
      "Premium portföylerde SEO, içerik akışı, görsel alt metni, iç bağlantı ve CTA kullanımıyla daha nitelikli talep oluşturmanın yolları.",
    publishedAt: "2026-03-16T15:30:00.000Z",
  },
  {
    id: "blog-1",
    slug: "istanbulda-luks-konut-yatiriminda-2026-trendleri",
    title: "İstanbul'da Nitelikli Konut Yatırımında 2026 Trendleri",
    excerpt:
      "Lokasyon gücü, teslim takvimi, kira potansiyeli ve çıkış likiditesi üzerinden 2026 konut yatırım eğilimlerini değerlendiriyoruz.",
    content: `İstanbul konut pazarında 2026 yılının en belirgin farkı, alıcıların yalnızca metrekareye değil yaşam altyapısı, erişim kolaylığı ve hizmet kalitesine göre karar vermesi oldu.

Levent, Nişantaşı ve sahil hattındaki yeni portföylerde güvenlik, sosyal alan kalitesi ve yönetim hizmetleri fiyat kadar belirleyici hale geliyor.

Yatırımcı tarafında kısa vadeli al-sat yaklaşımı yerine, kira getirisi ve çıkış likiditesi birlikte analiz ediliyor. Bu nedenle portföy incelerken teslim tarihi, proje ölçeği ve çevre gelişim planı birlikte okunmalı.`,
    coverImage: imageSet1.cover,
    authorName: "Econi Invest Araştırma Ekibi",
    tags: ["İstanbul", "Konut Yatırımı", "Yatırım", "2026"],
    metaTitle: "İstanbul Konut Yatırımı 2026 Trendleri | Econi Invest Blog",
    metaDescription:
      "İstanbul'da konut yatırımı yaparken 2026 trendlerini, kira getirisi, lokasyon analizi ve çıkış likiditesiyle birlikte inceleyin.",
    publishedAt: "2026-03-12T09:10:00.000Z",
  },
  {
    id: "blog-2",
    slug: "portfoy-satista-dogru-fiyatlandirma-stratejisi",
    title: "Portföy Satışında Doğru Fiyatlandırma Stratejisi",
    excerpt:
      "Doğru fiyat bandı, satış süresini ve teklif kalitesini doğrudan etkiler. Uygulamada kullanılan net yaklaşım adımları.",
    content: `Gayrimenkul satış sürecinin en kritik adımı doğru başlangıç fiyatıdır. Piyasa üstü fiyatlar ilan görünürlüğünü düşürürken, piyasa altı fiyatlar mülk sahibinin değer kaybına yol açabilir.

Doğru fiyatlandırma için benzer portföy karşılaştırması, bölge arz-talep dengesi ve ilan performans metrikleri birlikte değerlendirilmelidir.

Econi Invest modelinde danışmanlar fiyatı tek bir rakamdan çok stratejik bant olarak değerlendirir. Bu yaklaşım, hem daha hızlı teklif almayı hem de müzakere alanını korumayı sağlar.`,
    coverImage: imageSet5.cover,
    authorName: "Selin Yıldız",
    tags: ["Satış", "Fiyatlandırma", "Portföy Yönetimi"],
    metaTitle: "Portföy Satışında Doğru Fiyatlandırma Stratejisi | Econi Invest Blog",
    metaDescription:
      "Gayrimenkul portföylerinde doğru fiyatlandırma nasıl yapılır? Satış süresini kısaltan temel stratejileri öğrenin.",
    publishedAt: "2026-03-10T11:40:00.000Z",
  },
];
