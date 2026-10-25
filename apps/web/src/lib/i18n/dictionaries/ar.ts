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
