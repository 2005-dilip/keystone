export interface ServiceAreaRegion {
  id: string;
  name: string;
  tag: string;
  question: string;
  paragraphs: string[];
}

export interface ServiceAreaFAQ {
  question: string;
  answer: string;
}

export interface ServiceAreaData {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  eyebrow: string;
  lead: string;
  regions: ServiceAreaRegion[];
  faqs: ServiceAreaFAQ[];
  cta: {
    name: string;
    phone: string;
    phoneTel: string;
    email: string;
    note: string;
  };
}

export const SERVICE_AREA_DATA: ServiceAreaData = {
  metaTitle: 'Contractor in Calgary, Edmonton, Red Deer | Keystone',
  metaDescription:
    'Keystone Renovations serves Calgary, Edmonton, Red Deer and communities across Alberta with permitted, warrantied construction and renovation work.',
  headline: 'Contractor Serving Calgary, Edmonton, Red Deer and All of Alberta',
  eyebrow: 'PROVINCIAL CONSTRUCTION & RENOVATION COVERAGE',
  lead:
    'With dedicated crews based in both Calgary and Edmonton, Keystone Renovations delivers code-compliant, permitted, and warrantied construction anywhere in Alberta — without long delays or stranger subcontractors.',
  regions: [
    {
      id: 'calgary',
      name: 'Calgary (Headquarters)',
      tag: 'HEADQUARTERS & LOCAL CREWS',
      question: 'Looking for a Reliable Contractor in Calgary?',
      paragraphs: [
        "Calgary is home base for Keystone, with a crew based here. We know the city's permit process, neighbourhood rules and how chinooks and hard winters affect building. Site visits are easy to arrange, and once the job is done you can still reach Gaurav directly, because we treat your project as our own. Whether it is a basement, a garage or a commercial space, the plan fits your property.",
      ],
    },
    {
      id: 'edmonton',
      name: 'Edmonton',
      tag: 'LOCAL EDMONTON CREW BASED',
      question: 'Need a Contractor in Edmonton Who Actually Turns Up?',
      paragraphs: [
        'Keystone has a crew based right in Edmonton, so you are not waiting on a long drive from Calgary. We take on renovations, concrete, framing, painting and more, arrange the local permits and keep you updated from the first day to the last. Materials and schedule are planned before work begins.',
      ],
    },
    {
      id: 'red-deer',
      name: 'Red Deer',
      tag: 'CENTRAL ALBERTA CORRIDOR',
      question: 'Hiring in Red Deer Without Waiting Weeks?',
      paragraphs: [
        'Red Deer sits between Calgary and Edmonton, and our crews from both cities reach it often. Tell us what you need and we will talk through scope, timing and what the job realistically involves. Small repairs and larger projects are both welcome, and neither is treated as less important. We answer calls and emails quickly.',
      ],
    },
    {
      id: 'alberta-wide',
      name: 'All of Alberta & Rural Communities',
      tag: 'PROVINCE-WIDE TRAVEL CREWS',
      question: 'What if I Live Somewhere Else in Alberta?',
      paragraphs: [
        'Call us anyway. Our Calgary and Edmonton crews travel across the province, and we work with neighbours on residential and commercial projects, with no minimum job size. Every project receives the same planning, permits, inspections and 3 to 5 year workmanship warranty, wherever it happens to be.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Do you work outside Calgary?',
      answer:
        'Yes. We have crews based in Calgary and Edmonton, and they travel across Alberta, including Red Deer and smaller communities. Tell us where your property is and we will confirm the details.',
    },
    {
      question: 'Is there a travel charge for jobs in Edmonton or Red Deer?',
      answer:
        'We discuss travel and logistics openly while planning your quote, so nothing unexpected appears on the final bill.',
    },
    {
      question: 'Do you handle permits in other cities and towns?',
      answer:
        'Yes. Permit rules differ between municipalities, so we check what your location requires and handle the application for you.',
    },
    {
      question: 'How quickly can you visit my property to discuss the work?',
      answer:
        'We respond within 24 hours of your call or email, and the on site visit is free. We look at the space, listen to what you need and explain your options.',
    },
    {
      question: 'Does the warranty apply to jobs outside Calgary?',
      answer:
        'Yes. The same workmanship warranty of 3 to 5 years, depending on the job, applies wherever your project is located.',
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
