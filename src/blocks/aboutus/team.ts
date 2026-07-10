export type TeamContact = {
  email?: string
  heading?: string
  phone?: string
}

export type TeamQuestion = {
  answer: string
  question: string
}

export type TeamMember = {
  bio: string
  contact?: TeamContact
  imageAlt?: string
  imageUrl?: string
  initials: string
  name: string
  questions: TeamQuestion[]
  role: string
}

export type AboutTeamContent = {
  contact: TeamContact
  members: TeamMember[]
  title: string
}

export const defaultTeamContact = {
  email: 'sales@pioneersgears.com',
  heading: 'Project enquiries',
  phone: '+86 199 5279 2557',
} satisfies TeamContact

export const aboutTeamContent: AboutTeamContent = {
  contact: defaultTeamContact,
  members: [
    {
      bio: 'Steven co-founded the factory in 2010 and leads overall company operations',
      imageUrl: 'https://cdn.pioneersgears.com/images/Steven Chen.webp',
      initials: '01',
      name: 'Steven Chen',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            "I oversee the factory's overall operations and strategic direction, making sure our manufacturing standards stay consistently high.",
        },
        {
          question: 'What is your favourite thing about working for Xiangle Tools?',
          answer:
            'Building a team of craftsmen who care about precision, and seeing our cargo control products trusted by partners all over the world.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'Factory life is demanding, so I like to relax by running and exercising to clear my mind.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'hot-pot is perfect for gathering family around the table.',
        },
      ],
      role: 'General Manager',
    },
    {
      bio: 'Co-founded the factory and supports production coordination and daily operations.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Sophia Liu.webp',
      initials: '02',
      name: 'Sophia Liu',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I manage daily operations and coordinate the crucial steps between our sales team and the production floor to keep projects moving.',
        },
        {
          question: 'What is your favourite thing about working here?',
          answer:
            'The collaborative energy. I love solving daily logistical puzzles and watching our team overcome complex manufacturing challenges together.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'Relaxing at home. Playing with our two daughters and feeding the cats gives me the perfect reset after a fast-paced day.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'handmade pork and cabbage dumplings',
        },
      ],
      role: 'Assistant Manager',
    },
    {
      bio: 'Dustin started with us in 2023 and leads global sales strategy and key account development.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Dustin Xu.webp',
      initials: '03',
      name: 'Dustin Xu',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I lead our global sales strategy, handle key accounts, and drive our direct-to-consumer digital initiatives in the US market.',
        },
        {
          question: 'What is your favourite thing about working for Xiangle Tools?',
          answer:
            'I get to bridge the gap between traditional factory craftsmanship and modern digital efficiency, constantly pushing our boundaries.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'I enjoy coding custom software tools, optimizing servers, and taking our gear outdoors to test it in real-world environments.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'steak',
        },
      ],
      role: 'Sales Manager',
    },
    {
      bio: 'Warren joined in 2018 and focuses on new inquiries and account follow-up.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Warren Wu.webp',
      initials: '04',
      name: 'Warren Wu',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I guide new international inquiries from the first email to production, ensuring customer requirements perfectly match our capabilities.',
        },
        {
          question: 'What is your favourite thing about working here?',
          answer:
            'That exciting moment when a brand new inquiry turns into a successful, long-term partnership built on trust.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'I love hiking and exploring local mountain trails to disconnect from screens and emails.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'Bang Bang Chicken',
        },
      ],
      role: 'Sales Executive',
    },
    {
      bio: 'Alex Zuo joined in 2019 and handles inquiries, quotations, and order follow-up for international customers.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Alex Zuo.webp',
      initials: '05',
      name: 'Alex Zuo',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I manage detailed quotations and follow up on orders, making sure every specification, from webbing strength to hardware finish, is exact.',
        },
        {
          question: 'What is your favourite thing about working for Xiangle Tools?',
          answer:
            "Our uncompromising dedication to precision. Knowing our quick-release hooks and straps won't fail our customers gives me great confidence.",
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'I am a bit of a detail nerd, so I spend my free time reading about industrial design and building intricate scale models.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'Dan Dan Noodles',
        },
      ],
      role: 'Sales Executive',
    },
    {
      bio: 'Zhuang joined our team in 2025, managing custom production, sample coordination, and OEM order execution.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Zhuang Kai.webp',
      initials: '08',
      name: 'Zhuang Kai',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I take the lead on custom OEM orders, managing the sourcing of specialized materials and coordinating complex sample production.',
        },
        {
          question: 'What is your favourite thing about working here?',
          answer:
            'Taking a highly complex, custom requirement from a client and engineering a practical, manufacturable solution that works perfectly.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'I love tinkering with mechanics. You can usually find me in my garage restoring old machinery or fixing engines.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'fried rice',
        },
      ],
      role: 'Production Manager',
    },
    {
      bio: 'Zhou joined our team in 2018, managing standard product production, scheduling, and quality control.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Zhou Yao Qian.webp',
      initials: '09',
      name: 'Zhou Yao Qian',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I manage the factory floor for our standard product lines, ensuring tight scheduling and rigorous hands-on quality control.',
        },
        {
          question: 'What is your favourite thing about working for Xiangle Tools?',
          answer:
            'The satisfaction of executing a perfectly organized production schedule and hitting every single delivery date without compromising quality.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'I grab my fishing rod and head to quiet spots by the lake, far away from the noise of the factory floor.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'dumplings',
        },
      ],
      role: 'Production Manager',
    },
    {
      bio: 'Sunny joined in 2020 and coordinates sales, production, and logistics.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Sunny Meng.webp',
      initials: '10',
      name: 'Sunny Meng',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I coordinate between sales, production, and logistics to ensure all order details, shipping documents, and product specifications are accurate and aligned.',
        },
        {
          question: 'What is your favourite thing about working here?',
          answer:
            'I enjoy the fast-paced environment. There is a real sense of achievement in making sure every order moves smoothly from production to shipment.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'Photography. I love walking around the city capturing urban landscapes and interesting architecture.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'soup dumplings (Xiaolongbao)',
        },
      ],
      role: 'Order Coordinator',
    },
    {
      bio: 'Joined in 2019 and handles payments, bookkeeping, and financial operations.',
      imageUrl: 'https://cdn.pioneersgears.com/images/Jenniler Xu.webp',
      initials: '11',
      name: 'Jenniler Xu',
      questions: [
        {
          question: 'What do you do at Xiangle Tools?',
          answer:
            'I manage all of the company’s financial operations, including international payments, bookkeeping, and ensuring our financial foundation is solid.',
        },
        {
          question: 'What is your favourite thing about working for Xiangle Tools?',
          answer:
            'Bringing order to complex data. It is incredibly satisfying to see the factory’s steady, hard-earned growth reflected accurately in the numbers.',
        },
        {
          question: 'What do you like to do when you are not at work?',
          answer:
            'I spend my weekends tending to my garden and relaxing with a good historical fiction novel.',
        },
        {
          question: 'If you had to eat one meal for the rest of your life what would it be?',
          answer: 'peking duck',
        },
      ],
      role: 'Finance',
    },
  ],
  title: 'Meet Our Team',
}
