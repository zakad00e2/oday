# Hotel Image Backend Spec

## الهدف

تمكين تعديل صور الفندق بشكل صحيح من لوحة التحكم بدون:

- تراكم الصور القديمة مع الجديدة
- تكرار `main image`
- فقدان ترتيب المعرض
- بقاء ملفات orphaned في التخزين

المشكلة الحالية في الـ API القائم أنه يقبل رفع صور أثناء `PATCH` لكنه لا يوفّر عقدًا واضحًا لـ:

- حذف صورة قديمة
- استبدال الصورة الرئيسية
- إعادة ترتيب صور المعرض
- معرفة أي صورة يجب الاحتفاظ بها وأي صورة يجب حذفها

النتيجة أن الصور تتراكم داخل `assets` بدل أن تُدار كسجل قابل للتعديل.

---

## الحل المقترح

اعتماد جدول مستقل لأصول الفندق `hotel_assets` مع endpoints صريحة لإدارة الصور.

لا تعتمد على تخزين الصور داخل `main_image_url` و`gallery_images` فقط، لأن هذا يجعل الحذف والاستبدال وإعادة الترتيب غير آمنين.

---

## قاعدة البيانات

### جدول الفنادق

يبقى جدول `hotels` للبيانات الأساسية فقط.

```sql
create table hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  video_url text,
  features text[],
  stars int default 4,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### جدول أصول الفندق

```sql
create table hotel_assets (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  kind text not null check (kind in ('MAIN', 'GALLERY')),
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  alt_text text,
  is_deleted boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index hotel_assets_hotel_id_idx on hotel_assets(hotel_id);
create unique index hotel_assets_single_main_idx
  on hotel_assets(hotel_id)
  where kind = 'MAIN' and is_deleted = false;
```

### ملاحظات

- يجب أن يكون لكل فندق صورة رئيسية واحدة فقط.
- صور المعرض يمكن أن تكون صفر أو أكثر.
- `sort_order` يحدد ترتيب العرض داخل المعرض.
- الحذف يكون منطقيًا `is_deleted = true` ثم حذف الملف من التخزين.

---

## شكل الـ API

### 1. جلب الفندق مع الصور

`GET /api/admin/hotels/:id`

```json
{
  "success": true,
  "data": {
    "id": "hotel-id",
    "name": "Al Nakheel Hotel",
    "description": "....",
    "video_url": "https://...",
    "features": ["Pool", "Spa"],
    "stars": 5,
    "assets": [
      {
        "id": "asset-main-1",
        "kind": "MAIN",
        "url": "https://cdn.example.com/hotels/hotel-id/main.jpg",
        "sort_order": 0
      },
      {
        "id": "asset-gallery-1",
        "kind": "GALLERY",
        "url": "https://cdn.example.com/hotels/hotel-id/gallery-1.jpg",
        "sort_order": 1
      }
    ]
  }
}
```

### 2. رفع صور جديدة للفندق

`POST /api/admin/hotels/:id/images`

`multipart/form-data`

الحقول:

- `mainImages`: ملفات الصورة الرئيسية الجديدة
- `galleryImages`: ملفات صور المعرض الجديدة

السلوك:

- إذا رُفعت `mainImages`:
  يتم إنشاء أصول جديدة.
  ثم تُحوّل آخر صورة رئيسية مرفوعة إلى `MAIN`.
  وأي صورة رئيسية قديمة تتحول إلى `GALLERY` أو تُحذف حسب سياسة المشروع.

السياسة الموصى بها:
حوّل القديمة إلى `GALLERY` فقط إذا كان هذا مطلوبًا تجاريًا.
إن لم يكن مطلوبًا، احذف القديمة من قاعدة البيانات والتخزين.

- إذا رُفعت `galleryImages`:
  تضاف كصور معرض جديدة في آخر الترتيب.

الرد:

```json
{
  "success": true,
  "data": {
    "mainAssetId": "asset-main-2",
    "assets": []
  }
}
```

### 3. حذف صورة

`DELETE /api/admin/hotels/:hotelId/images/:assetId`

السلوك:

- التأكد أن `assetId` يتبع الفندق.
- وضع `is_deleted = true`.
- حذف الملف من التخزين.
- لو كانت الصورة المحذوفة `MAIN`:
  - إذا توجد صور Gallery: أول صورة حسب الترتيب تصبح `MAIN`.
  - إذا لا توجد صور أخرى: رفض الطلب `409` لأن الفندق يجب أن يملك صورة رئيسية واحدة على الأقل.

### 4. تعيين صورة رئيسية

`PATCH /api/admin/hotels/:hotelId/images/:assetId/set-main`

السلوك:

- التأكد أن `assetId` يتبع الفندق.
- الصورة المحددة تصبح `MAIN`.
- أي صورة `MAIN` أخرى تتحول إلى `GALLERY`.

### 5. إعادة ترتيب صور المعرض

`PATCH /api/admin/hotels/:hotelId/images/reorder`

```json
{
  "assetIds": [
    "asset-gallery-3",
    "asset-gallery-1",
    "asset-gallery-2"
  ]
}
```

السلوك:

- القائمة تحتوي فقط على صور `GALLERY` غير المحذوفة.
- يتم تحديث `sort_order` داخل transaction واحدة.

### 6. تعديل بيانات الفندق النصية بدون الصور

`PUT /api/admin/hotels/:id`

هذا endpoint يجب أن يحدّث فقط:

- الاسم
- الوصف
- الفيديو
- الخصائص
- النجوم
- بقية الحقول النصية

ولا يتعامل مع الصور.

هذا الفصل مطلوب حتى لا يصبح تعديل البيانات العادية مرتبطًا بمنطق الصور.

---

## سيناريوهات الواجهة

### تغيير الصورة الرئيسية

1. الفرونت يرفع الصورة عبر `POST /images`.
2. الباك يرجع `assetId`.
3. إذا لزم، الفرونت يستدعي `set-main`.
4. الفرونت يعيد جلب الفندق.

### حذف صورة من المعرض

1. الفرونت يستدعي `DELETE /images/:assetId`
2. الباك يحذف من DB + Storage
3. الفرونت يعيد جلب الفندق

### إعادة ترتيب المعرض

1. الفرونت يرسل `assetIds` بالترتيب الجديد
2. الباك يحدّث `sort_order`
3. الفرونت يحدث العرض محليًا أو يعيد الجلب

---

## قواعد مهمة داخل الباك إند

- كل عمليات الصور يجب أن تكون داخل transaction.
- لا تسمح بوجود أكثر من `MAIN`.
- لا تسمح بحذف آخر صورة رئيسية بدون بديل.
- لا تعتمد على URL وحده كمفتاح حذف.
  استخدم `assetId` و`storage_path`.
- عند حذف صورة من التخزين، لو فشل الحذف:
  سجّل الخطأ وأعد المحاولة عبر job لاحقة.

---

## أخطاء متوقعة

### حذف آخر صورة رئيسية

```json
{
  "success": false,
  "error": "Hotel must have at least one main image",
  "code": 409
}
```

### صورة لا تتبع الفندق

```json
{
  "success": false,
  "error": "Asset does not belong to this hotel",
  "code": 404
}
```

### نوع ملف غير مدعوم

```json
{
  "success": false,
  "error": "Unsupported file type",
  "code": 400
}
```

---

## أقل تنفيذ مطلوب

إذا أردت أسرع نسخة عملية بدون تعقيد كبير، نفّذ هذه الأربع فقط:

1. `GET /api/admin/hotels/:id`
2. `POST /api/admin/hotels/:id/images`
3. `DELETE /api/admin/hotels/:hotelId/images/:assetId`
4. `PATCH /api/admin/hotels/:hotelId/images/:assetId/set-main`

ثم أضف `reorder` بعد ذلك.

---

## ملاحظة مهمة للباك إند الحالي

إذا استمر endpoint الحالي في استقبال `PATCH multipart` على الفندق نفسه، فلا يجب أن يتعامل مع الصور بأسلوب append فقط.

إما:

- فصل الصور في endpoints مستقلة كما هو مقترح هنا

أو:

- دعم حقول صريحة داخل `PATCH` مثل:
  - `retainAssetIds`
  - `deleteAssetIds`
  - `newMainImages`
  - `newGalleryImages`
  - `mainAssetId`
  - `galleryOrder`

لكن الفصل عبر endpoints مستقلة أبسط وأنظف للفرونت والباك إند.
