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
    about: 'نبذة عني',
    projects: 'المشاريع',
    blog: 'المدونة',
  },
  dates: {
    present: 'الآن',
  },
  home: {
    highlights: 'أبرز الأرقام',
    seeMyWork: 'شاهد أعمالي',
    selectedWork: 'أعمال مختارة',
    allProjects: 'كل المشاريع',
    whatIDo: 'ما أقدّمه',
    fullStory: 'المسيرة كاملة',
  },
  profile: {
    emailMe: 'راسلني',
    downloadCv: 'تحميل السيرة الذاتية',
    languageLevels: {
      native: 'اللغة الأم',
      fluent: 'بطلاقة',
      professional: 'مستوى مهني',
      intermediate: 'مستوى متوسط',
      beginner: 'مستوى مبتدئ',
    },
  },
  about: {
    title: 'نبذة عني',
    description:
      'أين عملت، والأدوات التي أستخدمها، وماذا درست، واللغات التي أتحدثها.',
    heading: 'الخبرة والمهارات',
    lead: 'الوظائف والأدوات والدراسة التي يقوم عليها عملي.',
    experience: 'الخبرة المهنية',
    skills: 'المهارات',
    education: 'التعليم',
    spokenLanguages: 'اللغات',
    currently: 'حاليًا',
  },
  blog: {
    title: 'كتابات',
    description:
      'ملاحظات عن بناء منتجات الويب: الهندسة البرمجية، والواجهات العربية، والتفاصيل بينهما.',
    // Arabic counting forms: 1 مقال, 2 مقالان, 3–10 مقالات, 11–99 مقالًا.
    counts: {
      articles: {
        zero: 'مقالات',
        one: 'مقال',
        two: 'مقالان',
        few: 'مقالات',
        many: 'مقالًا',
        other: 'مقال',
      },
      series: {
        zero: 'سلاسل',
        one: 'سلسلة',
        two: 'سلسلتان',
        few: 'سلاسل',
        many: 'سلسلة',
        other: 'سلسلة',
      },
      topics: {
        zero: 'مواضيع',
        one: 'موضوع',
        two: 'موضوعان',
        few: 'مواضيع',
        many: 'موضوعًا',
        other: 'موضوع',
      },
    },
    topic: 'الموضوع',
    empty: 'لا توجد مقالات هنا بعد.',
    showAll: 'عرض كل المقالات',
    backToAll: 'كل المقالات',
    // Arabic counts: 1 دقيقة, 2 دقيقتان, 3–10 دقائق, 11 and up دقيقة.
    readingTime: (minutes: number) => {
      if (minutes === 1) return 'قراءة دقيقة واحدة'
      if (minutes === 2) return 'قراءة دقيقتين'
      return `قراءة ${String(minutes)} ${minutes <= 10 ? 'دقائق' : 'دقيقة'}`
    },
    seriesPart: (part: number, total: number) =>
      `الجزء ${String(part)} من ${String(total)}`,
  },
  contact: {
    label: 'تواصل',
    question: 'لديك مشروع في ذهنك؟',
    answer: 'لنبنِه معًا.',
  },
  technologies: {
    categories: {
      language: 'لغات البرمجة',
      frontend: 'الواجهة الأمامية',
      backend: 'الواجهة الخلفية',
      mobile: 'تطبيقات الجوال',
      ai: 'الذكاء الاصطناعي',
      database: 'قواعد البيانات',
      devops: 'DevOps',
      tool: 'الأدوات',
    },
  },
  career: {
    fieldSeparator: '، ',
    current: 'الحالي',
    employmentTypes: {
      full_time: 'دوام كامل',
      part_time: 'دوام جزئي',
      freelance: 'عمل حر',
      contract: 'عقد',
      internship: 'تدريب',
      co_founder: 'شريك مؤسس',
    },
    workModes: {
      remote: 'عن بُعد',
      onsite: 'حضوري',
      hybrid: 'هجين',
    },
  },
  availability: {
    open_to_both: 'متاح للعمل',
    open_to_work: 'متاح للعمل',
    open_to_freelance: 'متاح للعمل الحر',
    not_available: 'غير متاح',
  },
  projects: {
    eyebrow: 'أعمال مختارة',
    title: 'المشاريع',
    description: 'منتجات ومشاريع لعملاء بنيتها من التخطيط حتى الإطلاق.',
    filters: 'تصفية المشاريع',
    type: 'النوع',
    all: 'الكل',
    empty: 'لا توجد مشاريع تطابق هذه التصفية.',
    showAll: 'عرض كل المشاريع',
    visitSite: 'زيارة الموقع',
    sourceCode: 'الشيفرة المصدرية',
    types: {
      client: 'مشروع عميل',
      product: 'منتج',
      personal: 'مشروع شخصي',
      academic: 'مشروع أكاديمي',
    },
    backToAll: 'كل المشاريع',
    role: 'الدور',
    client: 'العميل',
    builtAt: 'أُنجز في',
    dates: 'الفترة',
    keyNumbers: 'أرقام رئيسية',
    techStack: 'التقنيات المستخدمة',
    gallery: 'معرض الصور',
    moreProjects: 'مشاريع أخرى',
    previous: 'المشروع السابق',
    next: 'المشروع التالي',
    readCaseStudy: 'اقرأ دراسة الحالة',
  },
  content: {
    copy: 'نسخ',
    copied: 'تم النسخ',
    callout: {
      note: 'ملاحظة',
      tip: 'نصيحة',
      warning: 'تنبيه',
      danger: 'مهم',
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
