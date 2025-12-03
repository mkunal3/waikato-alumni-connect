// Centralized content configuration for English and Maori translations
// This file contains all bilingual text content for the website

export const content = {
  // Navigation
  nav: {
    login: { en: 'Login', mi: 'Takiuru' },
    studentLogin: { en: 'Student Login', mi: 'Takiuru Ākonga' },
    mentorLogin: { en: 'Mentor Login', mi: 'Takiuru Kaitohutohu' },
    adminLogin: { en: 'Admin Login', mi: 'Takiuru Kaitiaki' },
  },

  // Hero Section
  hero: {
    welcome: { 
      en: 'Welcome to Waikato Alumni Connect', 
      mi: 'Haere mai ki Waikato Alumni Connect' 
    },
    tagline: { 
      en: 'Where students & alumni grow together.', 
      mi: 'Mā te mahi ngātahi e tipu ai ngā ākonga me ngā alumni.' 
    },
    findMentor: { en: 'Find a Mentor', mi: 'Kimihia he Kaitohutohu' },
    becomeMentor: { en: 'Become a Mentor', mi: 'Hei Kaitohutohu' },
    searchPlaceholder: { 
      en: 'Search by name, industry, location...', 
      mi: 'Mā te ingoa, te rāngai, te wāhi...' 
    },
  },

  // Three Types of Mentoring
  mentoringTypes: {
    title: { en: 'Three Types of Mentoring', mi: 'Ngā Momo Arataki e Toru' },
    subtitle: { 
      en: 'Choose the mentoring style that fits your needs and career goals', 
      mi: 'Kōwhiria te momo arataki e pai ana ki ō hiahia me ō whāinga umanga' 
    },
    oneOff: {
      title: { en: 'One-Off Advice', mi: 'Tohutohu Kotahi Anake' },
      badge: { en: 'Single session', mi: 'Kotahi hui' },
      description: { 
        en: 'Quick support via phone, email, or a single meeting for CV tips, interview prep, and industry insights.', 
        mi: 'Āwhina tere mō te CV, te whakareri uiui, me ngā mōhiohio rāngai.' 
      },
    },
    vocational: {
      title: { en: 'Vocational Mentoring', mi: 'Arataki Umanga' },
      badge: { en: '2-3 sessions', mi: '2-3 Hui' },
      description: { 
        en: '2-3 sessions with deeper guidance on industry expectations, goal setting, and career planning.', 
        mi: 'Arataki hohonu mō te mahere umanga me ngā whāinga.' 
      },
    },
    employment: {
      title: { en: 'Employment Opportunities', mi: 'Whai Wāhitanga Mahi' },
      badge: { en: 'Ongoing', mi: 'Tonu tonu' },
      description: { 
        en: 'Access workplace visits, internship opportunities, and work experience placements.', 
        mi: 'Ngā toronga mahi, ngā tūnga whakangungu, me ngā tūnga wheako.' 
      },
    },
  },

  // How It Works
  howItWorks: {
    title: { en: 'How It Works', mi: 'Me Pēhea te Mahi' },
    subtitle: { 
      en: 'Four simple steps to connect with your mentor.', 
      mi: 'E whā ngā hipanga māmā hei hono atu ki tō kaitohutohu.' 
    },
    steps: [
      {
        title: { en: 'Register', mi: 'Rēhita' },
        description: { 
          en: 'Complete your profile with focus and preferences.', 
          mi: 'Tāurua ō kōrero whaiaro me ngā manakohanga.' 
        },
      },
      {
        title: { en: 'Browse & Match', mi: 'Tirotiro & Tautuhi' },
        description: { 
          en: 'Explore mentors and match scores.', 
          mi: 'Tīkina ngā kaitohutohu pai ki a koe.' 
        },
      },
      {
        title: { en: 'Connect', mi: 'Hono' },
        description: { 
          en: 'Send a match request and wait for acceptance.', 
          mi: 'Tuku tono hono.' 
        },
      },
      {
        title: { en: 'Grow', mi: 'Tupu' },
        description: { 
          en: 'Meet, track sessions, and grow your career.', 
          mi: 'Tūhono ki te kaitohutohu, ā, whakatipu tō umanga.' 
        },
      },
    ],
  },

  // Programme Guide
  programmeGuide: {
    title: { en: 'Programme Guide', mi: 'Aratohu Hōtaka' },
    subtitle: { 
      en: 'Everything you need to know about the Waikato Navigator Programme.', 
      mi: 'Ngā mea katoa mō Waikato Navigator.' 
    },
    forStudents: {
      title: { en: 'For Students', mi: 'Mō ngā Ākonga' },
      points: [
        { en: 'Available for final-year CMS students', mi: 'Wātea ki ngā ākonga tau whakamutunga o CMS' },
        { en: 'Upload CV and complete profile', mi: 'Tukuna tō CV me tō kōtaha' },
        { en: 'Choose mentoring styles and career interests', mi: 'Kōwhiria ngā momo arataki me ngā whāinga umanga' },
        { en: 'Matched with one mentor for 4-month programme', mi: 'Ka hono koe ki tētahi kaitohutohu mō te 4 marama' },
      ],
    },
    forMentors: {
      title: { en: 'For Mentors', mi: 'Mō Ngā Kaitohutohu' },
      points: [
        { en: 'Open to all Waikato alumni', mi: 'Wātea ki ngā alumni katoa o Waikato' },
        { en: 'Share expertise and professional journey', mi: 'Tohaina ō pūkenga me tō haerenga' },
        { en: 'Choose flexible mentoring types', mi: 'Kōwhiria ngā momo arataki' },
        { en: 'Give back and support future careers', mi: 'Āwhina ki te whakatipu i ngā umanga o ngā ākonga' },
      ],
    },
  },

  // Tutorial Section
  tutorial: {
    title: { en: 'Watch: How to Use the Platform', mi: 'Mātaki: Me pēhea te whakamahi i te papaaho' },
    description: { 
      en: 'Learn how to get the most out of Waikato Navigator with our comprehensive tutorial video.', 
      mi: 'Akohia me pehea te whakamahi pai i a Waikato Navigator ma te ataata ako.' 
    },
    button: { en: 'Watch Tutorial Video', mi: 'Mātaki Ataata Akoranga' },
  },

  // Footer
  footer: {
    links: {
      about: { en: 'About Us', mi: 'Mō Mātou' },
      privacy: { en: 'Privacy', mi: 'Tūmataitinga' },
      terms: { en: 'Terms', mi: 'Ture' },
      contact: { en: 'Contact', mi: 'Whakapā mai' },
    },
    copyright: { 
      en: '© 2025 Waikato University', 
      mi: 'Te Whare Wānanga o Waikato' 
    },
    tagline: { 
      en: 'Alumni Mentoring Platform', 
      mi: 'Waikato Navigator' 
    },
  },
};

// Type definitions
export type BilingualText = {
  en: string;
  mi: string;
};


