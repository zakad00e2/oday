# Backend Handoff — Oday Tourism Website

## نظرة عامة
موقع سياحي مبني بـ Next.js 14 App Router.
لوحة التحكم جاهزة كـ UI على `/admin` تحتاج ربط بـ API حقيقي.
الموقع RTL (عربي) بالكامل.

---

## Tech Stack الفرونت إند
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm

---

## هيكل المشروع

```
app/
├── page.tsx              ← الصفحة الرئيسية
├── hotels/page.tsx       ← صفحة الفنادق
├── trips/page.tsx        ← صفحة الرحلات
├── gallery/page.tsx      ← صفحة المعرض
├── reviews/page.tsx      ← صفحة المراجعات
├── contact/page.tsx      ← صفحة التواصل
└── admin/
    ├── page.tsx          ← Dashboard
    ├── offers/page.tsx   ← إدارة العروض
    ├── hotels/page.tsx   ← إدارة الفنادق
    ├── trips/page.tsx    ← إدارة الرحلات
    ├── gallery/page.tsx  ← إدارة المعرض
    ├── reviews/page.tsx  ← إدارة المراجعات
    └── settings/page.tsx ← الإعدادات العامة

components/
├── admin/
│   ├── AdminSidebar.tsx  ← الشريط الجانبي
│   └── FileUpload.tsx    ← رفع الملفات (جاهز للربط)
├── Hero.tsx
├── ExclusiveOffers.tsx   ← مربوط بـ Supabase مسبقاً
├── Hotels.tsx
├── Packages.tsx
├── LocalTrips.tsx
├── Reviews.tsx
├── TravelGallery.tsx
└── ...
```

---

## قاعدة البيانات — Supabase

### جدول `hero`
```sql
create table hero (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  subtitle text,
  badge_text text,
  bg_image_url text,
  updated_at timestamptz default now()
);
```

### جدول `offers`
```sql
create table offers (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  price text not null,
  currency text default 'جنيه',
  duration text,
  highlight boolean default false,
  services text[],
  image text,
  sort_order int default 0,
  created_at timestamptz default now()
);
```

### جدول `hotels`
```sql
create table hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  main_image_url text,
  gallery_images text[],
  video_url text,
  features text[],
  stars int default 4,
  sort_order int default 0,
  created_at timestamptz default now()
);
```

### جدول `trips`
```sql
create table trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  duration text,
  price numeric,
  details text,
  sort_order int default 0,
  created_at timestamptz default now()
);
```

### جدول `packages`
```sql
create table packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  price numeric,
  currency text default 'جنيه',
  duration text,
  features text[],
  is_highlighted boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);
```

### جدول `gallery`
```sql
create table gallery (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text,
  caption_title text,
  caption_desc text,
  category text default 'all',
  sort_order int default 0,
  created_at timestamptz default now()
);
```

### جدول `reviews`
```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  profile_image_url text,
  rating int default 5,
  review_text text not null,
  trip_name text,
  is_visible boolean default true,
  created_at timestamptz default now()
);
```

### جدول `site_settings`
```sql
create table site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- البيانات الافتراضية
insert into site_settings (key, value) values
('company_name_ar', 'عدي للسياحة'),
('company_name_en', 'Oday Tourism'),
('phone', '+201032549630'),
('whatsapp', '201032549630'),
('email', 'info@odaytourism.com'),
('address', 'القاهرة، مصر'),
('facebook', ''),
('instagram', ''),
('tiktok', '');
```

---

## API Endpoints المطلوبة

### Public Endpoints (الموقع يقرأ منها)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hero` | بيانات الهيرو |
| GET | `/api/offers` | العروض الحصرية |
| GET | `/api/hotels` | الفنادق |
| GET | `/api/trips` | الرحلات |
| GET | `/api/packages` | الباقات |
| GET | `/api/gallery` | معرض الصور |
| GET | `/api/reviews` | المراجعات المنشورة فقط |
| GET | `/api/settings` | إعدادات الموقع العامة |

### Admin Endpoints (محمية بـ JWT)

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | تسجيل دخول |
| POST | `/api/admin/logout` | تسجيل خروج |
| GET | `/api/admin/me` | التحقق من الجلسة |

#### Hero
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/admin/hero` | تعديل الهيرو |

#### Offers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/offers` | جلب كل العروض |
| POST | `/api/admin/offers` | إضافة عرض جديد |
| PUT | `/api/admin/offers/:id` | تعديل عرض |
| DELETE | `/api/admin/offers/:id` | حذف عرض |
| PATCH | `/api/admin/offers/reorder` | إعادة ترتيب |

#### Hotels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hotels` | جلب كل الفنادق |
| POST | `/api/admin/hotels` | إضافة فندق |
| PUT | `/api/admin/hotels/:id` | تعديل فندق |
| DELETE | `/api/admin/hotels/:id` | حذف فندق |

#### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/trips` | جلب كل الرحلات |
| POST | `/api/admin/trips` | إضافة رحلة |
| PUT | `/api/admin/trips/:id` | تعديل رحلة |
| DELETE | `/api/admin/trips/:id` | حذف رحلة |

#### Gallery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/gallery` | جلب كل الصور |
| POST | `/api/admin/gallery` | إضافة صورة |
| PUT | `/api/admin/gallery/:id` | تعديل صورة |
| DELETE | `/api/admin/gallery/:id` | حذف صورة |

#### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reviews` | جلب كل المراجعات |
| POST | `/api/admin/reviews` | إضافة مراجعة |
| PUT | `/api/admin/reviews/:id` | تعديل / إخفاء مراجعة |
| DELETE | `/api/admin/reviews/:id` | حذف مراجعة |

#### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/settings` | جلب الإعدادات |
| PUT | `/api/admin/settings` | تعديل الإعدادات |

#### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/upload` | رفع صورة أو فيديو |

---

## Response Format الموحد

```typescript
// نجاح
{
  success: true,
  data: T,
  message?: string
}

// خطأ
{
  success: false,
  error: string,
  code?: number
}
```

---

## Auth Flow

```
1. Admin يدخل email + password على /admin
2. الفرونت يرسل POST /api/admin/login
3. الباك يرجع JWT token
4. الفرونت يحفظه في httpOnly cookie
5. كل طلب admin يرسل: Authorization: Bearer <token>
6. Middleware يتحقق من التوكن قبل أي عملية
```

---

## File Upload

```
Endpoint : POST /api/admin/upload
Type     : multipart/form-data
Field    : file
Response : { success: true, data: { url: "https://..." } }

أنواع مقبولة:
- image/jpeg
- image/png  
- image/webp
- video/mp4

حد أقصى:
- صور  : 5MB
- فيديو: 50MB

Storage: Supabase Storage — bucket اسمه "oday-media"
```

---

## TypeScript Types (متفق عليها)

```typescript
interface HeroData {
  id: string;
  heading: string;
  subtitle: string;
  badge_text: string;
  bg_image_url: string;
  updated_at: string;
}

interface Offer {
  id: string;
  destination: string;
  price: string;
  currency: string;
  duration: string;
  highlight: boolean;
  services: string[];
  image: string;
  sort_order: number;
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  main_image_url: string;
  gallery_images: string[];
  video_url: string;
  features: string[];
  stars: number;
  sort_order: number;
}

interface Trip {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  price: number;
  details: string;
  sort_order: number;
}

interface Package {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  is_highlighted: boolean;
  sort_order: number;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption_title: string;
  caption_desc: string;
  category: string;
  sort_order: number;
}

interface Review {
  id: string;
  customer_name: string;
  profile_image_url: string;
  rating: number;
  review_text: string;
  trip_name: string;
  is_visible: boolean;
  created_at: string;
}

interface SiteSettings {
  company_name_ar: string;
  company_name_en: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
}
```

---

## متغيرات البيئة

### الفرونت إند `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### الباك إند `.env`
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=admin@odaytourism.com
ADMIN_PASSWORD=your-secure-password
```

---

## متطلبات إضافية

| المتطلب | التفاصيل |
|---------|---------|
| **Middleware** | حماية كل `/api/admin/*` بالتوكن |
| **CORS** | السماح فقط لدومين الموقع |
| **Rate Limiting** | 100 طلب/دقيقة للـ public routes |
| **Validation** | التحقق من البيانات قبل الحفظ (zod أو joi) |
| **Sort Order** | كل جدول فيه `sort_order` لترتيب العرض |

---

## ما جاهز من الفرونت إند ✅

- كل صفحات الموقع (Home, Hotels, Trips, Gallery, Reviews, Contact)
- لوحة تحكم كاملة على `/admin` — UI جاهز 100%
- صفحات الأدمن: Dashboard, Offers, Hotels, Trips, Gallery, Reviews, Settings
- `FileUpload` component جاهز — يحتاج فقط تغيير الـ endpoint
- `ExclusiveOffers` مربوط بـ Supabase مسبقاً كمثال للربط
- كل الـ Types محددة ومتفق عليها

## ما ينتظر الباك إند ⏳

- إنشاء الجداول في Supabase
- بناء الـ API endpoints
- استبدال البيانات الوهمية في الفرونت بـ API calls حقيقية
- ربط `FileUpload` بـ `/api/admin/upload`
- إضافة Auth حقيقي بدل الـ mock login الحالي

---

## تواصل وملاحظات

> أي تغيير في الـ Types أو الـ Endpoints يجب الاتفاق عليه مسبقاً
> لتجنب تعارض الفرونت مع الباك إند.