import type { Locale } from "./types";

export const dictionary = {
  "brand.name": { en: "ALIAN STORE", ar: "ALIAN STORE" },
  "brand.tagline": {
    en: "Modern living, curated.",
    ar: "أسلوب حياة عصري، باختيارات مدروسة.",
  },

  /* nav */
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.categories": { en: "Categories", ar: "الأقسام" },
  "nav.products": { en: "Shop", ar: "المتجر" },
  "nav.about": { en: "Why us", ar: "لماذا نحن" },
  "nav.reviews": { en: "Reviews", ar: "آراء العملاء" },
  "nav.search": { en: "Search products", ar: "ابحث عن منتج" },
  "nav.cart": { en: "Cart", ar: "السلة" },
  "nav.menu": { en: "Menu", ar: "القائمة" },
  "nav.admin": { en: "Dashboard", ar: "لوحة التحكم" },

  /* search */
  "search.title": { en: "What are you looking for?", ar: "عن إيه بتدور؟" },
  "search.hint": {
    en: "Search across every product in the store",
    ar: "ابحث في كل منتجات المتجر",
  },
  "search.placeholder": { en: "Try “organizer”…", ar: "جرّب “منظم”…" },
  "search.empty": { en: "No products matched your search.", ar: "مفيش نتائج مطابقة لبحثك." },
  "search.results": { en: "results", ar: "نتيجة" },
  "search.close": { en: "Close", ar: "إغلاق" },

  /* cart */
  "cart.title": { en: "Your cart", ar: "سلة المشتريات" },
  "cart.empty": { en: "Your cart is empty", ar: "السلة فاضية" },
  "cart.emptyHint": {
    en: "Add a few favourites and they will show up here.",
    ar: "ضيف منتجاتك المفضلة وهتظهر هنا.",
  },
  "cart.subtotal": { en: "Subtotal", ar: "الإجمالي" },
  "cart.shipping": { en: "Shipping", ar: "الشحن" },
  "cart.free": { en: "Free", ar: "مجاني" },
  "cart.total": { en: "Total", ar: "الإجمالي الكلي" },
  "cart.checkout": { en: "Checkout", ar: "إتمام الطلب" },
  "cart.continue": { en: "Continue shopping", ar: "متابعة التسوق" },
  "cart.remove": { en: "Remove item", ar: "إزالة المنتج" },
  "cart.added": { en: "Added to cart", ar: "تمت الإضافة للسلة" },
  "cart.increase": { en: "Increase quantity", ar: "زيادة الكمية" },
  "cart.decrease": { en: "Decrease quantity", ar: "تقليل الكمية" },
  "cart.freeShipNote": {
    en: "Free delivery on orders over EGP 500",
    ar: "توصيل مجاني للطلبات أكثر من ٥٠٠ ج.م",
  },

  /* product */
  "product.addToCart": { en: "Add to cart", ar: "أضف للسلة" },
  "product.buyNow": { en: "Buy now", ar: "اشتر الآن" },
  "product.inStock": { en: "In stock", ar: "متوفر" },
  "product.lowStock": { en: "Only a few left", ar: "كمية محدودة" },
  "product.outOfStock": { en: "Out of stock", ar: "غير متوفر" },
  "product.quantity": { en: "Quantity", ar: "الكمية" },
  "product.reviews": { en: "reviews", ar: "تقييم" },
  "product.wishlist": { en: "Save for later", ar: "احفظ للآخر" },
  "product.saved": { en: "Saved", ar: "محفوظ" },
  "product.details": { en: "Product details", ar: "تفاصيل المنتج" },
  "product.shipping": { en: "Shipping & returns", ar: "الشحن والإرجاع" },
  "product.shippingBody": {
    en: "Dispatched within 24 hours. Free delivery on orders above EGP 500, and easy 7-day returns on unused items.",
    ar: "يتم الشحن خلال ٢٤ ساعة. توصيل مجاني للطلبات أكثر من ٥٠٠ ج.م، وإرجاع سهل خلال ٧ أيام.",
  },
  "product.related": { en: "You may also like", ar: "قد يعجبك كمان" },
  "product.back": { en: "Back to shop", ar: "رجوع للمتجر" },
  "product.notFound": { en: "Product not found", ar: "المنتج غير موجود" },
  "product.sku": { en: "SKU", ar: "كود المنتج" },

  /* shop page */
  "shop.title": { en: "The collection", ar: "كل المنتجات" },
  "shop.subtitle": {
    en: "Filter, sort and explore the full ALIAN catalogue.",
    ar: "فلتر، رتب، واستكشف كل منتجات ALIAN.",
  },
  "shop.all": { en: "All", ar: "الكل" },
  "shop.filters": { en: "Filters", ar: "الفلاتر" },
  "shop.sort": { en: "Sort by", ar: "ترتيب حسب" },
  "shop.sort.featured": { en: "Featured", ar: "المميزة" },
  "shop.sort.priceAsc": { en: "Price: low to high", ar: "السعر: من الأقل" },
  "shop.sort.priceDesc": { en: "Price: high to low", ar: "السعر: من الأعلى" },
  "shop.sort.rating": { en: "Top rated", ar: "الأعلى تقييمًا" },
  "shop.sort.newest": { en: "Newest", ar: "الأحدث" },
  "shop.results": { en: "products", ar: "منتج" },
  "shop.empty": { en: "Nothing here yet", ar: "مفيش منتجات هنا" },
  "shop.emptyHint": {
    en: "Try another category or clear your filters.",
    ar: "جرب قسم تاني أو امسح الفلاتر.",
  },
  "shop.clear": { en: "Clear filters", ar: "مسح الفلاتر" },

  /* category page */
  "category.title": { en: "Category", ar: "القسم" },
  "category.browse": { en: "Browse all categories", ar: "كل الأقسام" },
  "category.empty": {
    en: "This category is being restocked.",
    ar: "القسم ده بيتحدث حاليًا.",
  },

  /* checkout */
  "checkout.title": { en: "Complete your order", ar: "أكمل بيانات الطلب" },
  "checkout.name": { en: "Full name", ar: "الاسم بالكامل" },
  "checkout.phone": { en: "Phone number", ar: "رقم الموبايل" },
  "checkout.address": { en: "Address", ar: "العنوان" },
  "checkout.city": { en: "City", ar: "المدينة" },
  "checkout.notes": { en: "Notes (optional)", ar: "ملاحظات (اختياري)" },
  "checkout.place": { en: "Place order", ar: "تأكيد الطلب" },
  "checkout.success": { en: "Order confirmed", ar: "تم تأكيد الطلب" },
  "checkout.successBody": {
    en: "Thanks! Our team will call you shortly to confirm delivery.",
    ar: "شكرًا لك! فريقنا هيتواصل معاك لتأكيد التوصيل.",
  },
  "checkout.reference": { en: "Order reference", ar: "رقم الطلب" },
  "checkout.required": { en: "Please fill the required fields.", ar: "من فضلك أكمل الحقول المطلوبة." },

  /* newsletter */
  "newsletter.title": { en: "Join the list", ar: "انضم لقائمتنا" },
  "newsletter.body": {
    en: "New drops, restocks and member-only offers — straight to your inbox.",
    ar: "أحدث المنتجات والعروض الحصرية على بريدك مباشرة.",
  },
  "newsletter.placeholder": { en: "you@email.com", ar: "بريدك الإلكتروني" },
  "newsletter.subscribe": { en: "Subscribe", ar: "اشترك" },
  "newsletter.success": { en: "You're on the list 🎉", ar: "تم الاشتراك بنجاح 🎉" },
  "newsletter.duplicate": { en: "You're already subscribed.", ar: "أنت مشترك بالفعل." },
  "newsletter.invalid": { en: "Enter a valid email address.", ar: "أدخل بريدًا إلكترونيًا صحيحًا." },
  "newsletter.privacy": {
    en: "No spam. Unsubscribe anytime.",
    ar: "من غير إزعاج. تقدر تلغي الاشتراك في أي وقت.",
  },

  /* admin */
  "admin.title": { en: "Store dashboard", ar: "لوحة تحكم المتجر" },
  "admin.subtitle": {
    en: "Create, edit and feature products in the catalogue.",
    ar: "أضف، عدّل، وميّز منتجات الكتالوج.",
  },
  "admin.new": { en: "New product", ar: "منتج جديد" },
  "admin.edit": { en: "Edit", ar: "تعديل" },
  "admin.delete": { en: "Delete", ar: "حذف" },
  "admin.save": { en: "Save product", ar: "حفظ المنتج" },
  "admin.cancel": { en: "Cancel", ar: "إلغاء" },
  "admin.seed": { en: "Load demo catalogue", ar: "تحميل منتجات تجريبية" },
  "admin.seedDone": { en: "Demo catalogue loaded", ar: "تم تحميل المنتجات التجريبية" },
  "admin.nameEn": { en: "Name (English)", ar: "الاسم (إنجليزي)" },
  "admin.nameAr": { en: "Name (Arabic)", ar: "الاسم (عربي)" },
  "admin.descEn": { en: "Description (English)", ar: "الوصف (إنجليزي)" },
  "admin.descAr": { en: "Description (Arabic)", ar: "الوصف (عربي)" },
  "admin.price": { en: "Price", ar: "السعر" },
  "admin.compareAt": { en: "Compare at price", ar: "السعر قبل الخصم" },
  "admin.category": { en: "Category", ar: "القسم" },
  "admin.image": { en: "Image path", ar: "مسار الصورة" },
  "admin.badge": { en: "Badge", ar: "الشارة" },
  "admin.stock": { en: "Stock", ar: "المخزون" },
  "admin.featured": { en: "Featured on homepage", ar: "مميز في الرئيسية" },
  "admin.active": { en: "Visible in store", ar: "ظاهر في المتجر" },
  "admin.saved": { en: "Product saved", ar: "تم حفظ المنتج" },
  "admin.deleted": { en: "Product deleted", ar: "تم حذف المنتج" },
  "admin.empty": { en: "No products yet.", ar: "مفيش منتجات لسه." },
  "admin.products": { en: "products", ar: "منتج" },
  "admin.orders": { en: "Recent orders", ar: "أحدث الطلبات" },
  "admin.viewStore": { en: "View store", ar: "عرض المتجر" },

  /* misc */
  "common.viewAll": { en: "View all", ar: "عرض الكل" },
  "common.explore": { en: "Explore", ar: "استكشف" },
  "common.new": { en: "New", ar: "جديد" },
  "common.sale": { en: "Sale", ar: "خصم" },
  "common.best": { en: "Bestseller", ar: "الأكثر مبيعًا" },
  "common.loading": { en: "Loading…", ar: "جاري التحميل…" },
  "common.days": { en: "d", ar: "ي" },
  "common.hours": { en: "h", ar: "س" },
  "common.minutes": { en: "m", ar: "د" },
  "common.seconds": { en: "s", ar: "ث" },
  "common.off": { en: "OFF", ar: "خصم" },
} as const;

export type TranslationKey = keyof typeof dictionary;

export function translate(key: TranslationKey, lang: Locale) {
  return dictionary[key][lang];
}
