import type { Dictionary } from './en'

export const ar = {
  layout: {
    skipToContent: 'تخطَّ إلى المحتوى',
    mainNavigation: 'التنقل الرئيسي',
    menu: 'القائمة',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    changeLanguage: 'تغيير اللغة',
    languages: 'اللغات',
    socialLinks: 'روابط التواصل',
  },
  nav: {
    home: 'الرئيسية',
    projects: 'المشاريع',
  },
  home: {
    emailMe: 'راسلني',
    downloadCv: 'تحميل السيرة الذاتية',
    highlights: 'أبرز الأرقام',
  },
  availability: {
    open_to_both: 'متاح لوظائف عن بُعد ولمشاريع العمل الحر',
    open_to_work: 'متاح لفرص عمل جديدة',
    open_to_freelance: 'متاح لمشاريع العمل الحر',
    not_available: 'غير متاح حاليًا',
  },
  projects: {
    title: 'المشاريع',
    description: 'منتجات ومشاريع لعملاء بنيتها من التخطيط حتى الإطلاق.',
    filters: 'تصفية المشاريع',
    type: 'النوع',
    technology: 'التقنية',
    all: 'الكل',
    empty: 'لا توجد مشاريع تطابق هذه التصفية.',
    showAll: 'عرض كل المشاريع',
    visitSite: 'زيارة الموقع',
    sourceCode: 'الشيفرة المصدرية',
    present: 'الآن',
    types: {
      client: 'مشروع عميل',
      product: 'منتج',
      personal: 'مشروع شخصي',
      academic: 'مشروع أكاديمي',
    },
  },
  notFound: {
    title: 'الصفحة غير موجودة',
    description: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    backHome: 'العودة إلى الرئيسية',
  },
  error: {
    title: 'حدث خطأ ما',
    description: 'تعذّر تحميل هذه الصفحة. يُرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',
  },
  theme: {
    switchTo: {
      light: 'التبديل إلى الوضع الفاتح',
      dark: 'التبديل إلى الوضع الداكن',
      system: 'استخدام وضع النظام',
    },
  },
} satisfies Dictionary
