export interface AboutStorySection {
  id: string;
  title: string;
  badge: string;
  paragraphs: string[];
}

export interface AboutFAQ {
  question: string;
  answer: string;
}

export interface AboutData {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  eyebrow: string;
  founder: {
    name: string;
    role: string;
    experienceYears: string;
    projectsCount: string;
    quote: string;
  };
  stories: AboutStorySection[];
  faqs: AboutFAQ[];
  cta: {
    name: string;
    phone: string;
    phoneTel: string;
    email: string;
    note: string;
  };
}

export const ABOUT_DATA: AboutData = {
  metaTitle: 'About Keystone Renovations | Calgary Contractor',
  metaDescription:
    'Meet Gaurav Tyagi and Keystone Renovations, a Calgary contractor built on 20 years of construction experience and a promise to stay after the job is done.',
  headline: 'About Keystone Renovations: A Calgary Contractor Built on Trust',
  eyebrow: 'FOUNDED ON TWENTY YEARS OF CONSTRUCTION INTEGRITY',
  founder: {
    name: 'Gaurav Tyagi',
    role: 'Founder & Project Director',
    experienceYears: '20+',
    projectsCount: '200+',
    quote: 'The crew that shows up should be the crew that finishes the job.',
  },
  stories: [
    {
      id: 'why-started',
      title: 'Why Gaurav Started Keystone Renovations',
      badge: 'OUR ORIGIN & VALUES',
      paragraphs: [
        'Gaurav Tyagi spent 20 years in construction and material supply management. In that time he saw a pattern that frustrated homeowners and businesses alike. Many contractors were attentive until the final payment, then became hard to reach when something needed fixing.',
        'Keystone was started to change that. Gaurav wanted to build a company of his own, put his full experience to work for his neighbours across Alberta, and treat every project as if it belonged to his own family.',
      ],
    },
    {
      id: 'experience',
      title: 'What 20 Years of Experience Means for Your Project',
      badge: 'MATERIAL SOURCING & PRICING',
      paragraphs: [
        "Gaurav has worked on more than 200 projects, and much of his career was spent sourcing materials. That matters to you. He knows what things really cost, which products suit Alberta's climate, and how to avoid the delays that stall a job halfway through.",
        'Keystone is a new company, and we say so openly. What is not new is the experience behind it. The person who plans your project has decades of hands on knowledge of how it should be built.',
      ],
    },
    {
      id: 'how-we-work',
      title: 'How We Work With You',
      badge: 'PLAIN LANGUAGE & PERMITS',
      paragraphs: [
        'We start with a free on site visit, where we listen first. Then we explain your options in plain language, give you a realistic timeline and deliver your project as quickly as quality work allows. We pull the permits and arrange the inspections ourselves, so you are never left holding paperwork.',
        'We work on residential and commercial properties, and there is no minimum project size. A small repair gets the same care as a large build.',
      ],
    },
    {
      id: 'our-promise',
      title: 'Our Promise After the Work Is Done',
      badge: '3-5 YEAR WARRANTY & LICENSING',
      paragraphs: [
        'Our workmanship warranty runs from 3 to 5 years depending on the job. More important than the paper is the promise behind it. If something needs attention, you call us and we answer.',
        'Keystone holds a City of Calgary business licence, WCB Alberta coverage and general liability insurance. You can ask to see these at any time, because trust should never depend on taking our word for it.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Who owns Keystone Renovations?',
      answer:
        'Gaurav Tyagi founded and runs Keystone. He brings 20 years of experience in construction and material supply management.',
    },
    {
      question: 'Is Keystone a new company?',
      answer:
        "Yes, the company is new. Gaurav's experience is not, and he has worked on more than 200 projects during his career.",
    },
    {
      question: 'Where is Keystone based, and where do you work?',
      answer:
        'Keystone is based in Calgary, Alberta, with crews in Calgary and Edmonton. They travel across the province, including Red Deer and smaller communities.',
    },
    {
      question: 'Are you licensed and insured?',
      answer:
        'Yes. We hold a City of Calgary business licence, WCB Alberta coverage and general liability insurance.',
    },
    {
      question: 'How do I start a project with you?',
      answer:
        'Call Gaurav at 403 505 4015 or email gaurav.tyagi@keystonerenov.com. We respond within 24 hours and offer a free on site visit to discuss your project.',
    },
  ],
  cta: {
    name: 'Gaurav',
    phone: '403 505 4015',
    phoneTel: '+14035054015',
    email: 'gaurav.tyagi@keystonerenov.com',
    note: 'The on site visit is free, and we respond within 24 hours.',
  },
};
