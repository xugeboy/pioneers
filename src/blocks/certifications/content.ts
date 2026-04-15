export type CertificationProof = {
  assetHref?: string
  assetLabel?: string
  issuer: string
  scope: string
  status: 'Available' | 'Documented' | 'Prepared'
  summary: string
  title: string
}

export type TestingStage = {
  focus: string
  outcome: string
  summary: string
  title: string
}

export type StandardItem = {
  response: string
  title: string
  whatItCovers: string
}

export type CommitmentPillar = {
  body: string
  title: string
}

export type DownloadAsset = {
  description: string
  fileSize?: string
  fileType: string
  href: string
  title: string
}

type StandardsGroup = {
  items: StandardItem[]
  title: string
}

type DownloadGroup = {
  items: DownloadAsset[]
  title: string
}

export const certificationsPageContent = {
  closingCta: {
    description:
      'Bring your product brief, target market, or buyer checklist and we can review what documentation, validation, and compliance support makes sense for the program.',
    primaryHref: '/request-quote',
    primaryLabel: 'Request product compliance details',
    secondaryHref: '/contact-us',
    secondaryLabel: 'Talk to our quality team',
    title: 'Need a sharper documentation conversation before sampling or production?',
  },
  commitments: [
    {
      body: 'Incoming checks, in-process inspection, and final review are treated as linked checkpoints instead of isolated activities.',
      title: 'Process discipline',
    },
    {
      body: 'We organize quality conversations around readable summaries, buyer-facing references, and request-based supporting documents.',
      title: 'Documentation clarity',
    },
    {
      body: 'The objective is repeatable output and fewer avoidable surprises between approval, production, and shipment.',
      title: 'Production consistency',
    },
  ] satisfies CommitmentPillar[],
  downloadGroups: [
    {
      items: [
        {
          description: 'Short summary of certification-oriented documentation prepared for buyer review.',
          fileSize: '833 B',
          fileType: 'PDF',
          href: '/downloads/pioneers-certification-overview.pdf',
          title: 'Certification overview',
        },
        {
          description: 'Process-facing snapshot of incoming inspection, in-process checks, and final review.',
          fileSize: '852 B',
          fileType: 'PDF',
          href: '/downloads/pioneers-quality-system-overview.pdf',
          title: 'Quality system overview',
        },
      ],
      title: 'Certificates and overviews',
    },
    {
      items: [
        {
          description: 'Concise reference for performance-oriented validation and load review conversations.',
          fileSize: '838 B',
          fileType: 'PDF',
          href: '/downloads/pioneers-load-testing-summary.pdf',
          title: 'Load testing summary',
        },
        {
          description: 'Shipment-readiness checklist focused on workmanship, labeling, and packaging checks.',
          fileSize: '853 B',
          fileType: 'PDF',
          href: '/downloads/pioneers-inspection-checklist.pdf',
          title: 'Final inspection checklist',
        },
      ],
      title: 'Testing summaries',
    },
    {
      items: [
        {
          description: 'Overview of labeling, declarations, and document readiness before launch or dispatch.',
          fileSize: '835 B',
          fileType: 'PDF',
          href: '/downloads/pioneers-compliance-readiness.pdf',
          title: 'Compliance readiness summary',
        },
      ],
      title: 'Compliance references',
    },
  ] satisfies DownloadGroup[],
  hero: {
    description:
      'A proof-first page for buyers, sourcing teams, and OEM or ODM partners who need a faster read on documentation readiness, validation rhythm, and quality commitment before inquiry.',
    primaryHref: '#downloads',
    primaryLabel: 'Download certifications',
    secondaryHref: '/contact-us',
    secondaryLabel: 'Contact quality team',
    title: 'Certifications, testing, and compliance you can review before inquiry.',
    trustBullets: ['Certification-ready', 'Testing-backed', 'Compliance-aware'],
  },
  proofCards: [
    {
      assetHref: '/downloads/pioneers-certification-overview.pdf',
      assetLabel: 'Download overview',
      issuer: 'Pioneers quality team',
      scope: 'Buyer-facing summary of documentation readiness and proof references',
      status: 'Available',
      summary:
        'Useful as a first review pack when a sourcing or procurement team wants to see how documentation conversations are structured before going deeper.',
      title: 'Certification overview',
    },
    {
      assetHref: '/downloads/pioneers-load-testing-summary.pdf',
      assetLabel: 'Download summary',
      issuer: 'Project-specific validation workflow',
      scope: 'Load, performance, and application-fit review points',
      status: 'Available',
      summary:
        'Built for teams that need a concise look at how test expectations and performance checkpoints are framed ahead of project approval.',
      title: 'Load testing summary',
    },
    {
      assetHref: '/downloads/pioneers-compliance-readiness.pdf',
      assetLabel: 'Download readiness note',
      issuer: 'Supplier coordination plus internal QA',
      scope: 'Material declarations, labeling review, and launch-readiness support',
      status: 'Prepared',
      summary:
        'Helps clarify how compliance-facing documents can be gathered, organized, and reviewed around a customer brief or target market.',
      title: 'Compliance readiness',
    },
    {
      assetHref: '/downloads/pioneers-inspection-checklist.pdf',
      assetLabel: 'Download checklist',
      issuer: 'Pioneers QC team',
      scope: 'Shipment readiness, packaging verification, and final inspection flow',
      status: 'Documented',
      summary:
        'A practical reference showing how final checks are framed before goods move into dispatch and buyer handoff.',
      title: 'Final inspection checklist',
    },
  ] satisfies CertificationProof[],
  quickFacts: [
    '4 proof documents ready for download',
    '5 validation checkpoints on the testing path',
    '3 standards and compliance groupings',
  ],
  standardsGroups: [
    {
      items: [
        {
          response:
            'We translate referenced expectations into review points that can be used during sampling, validation, and production release discussions.',
          title: 'Referenced test methods',
          whatItCovers:
            'Customer-defined or market-relevant performance criteria that need to be interpreted before approval.',
        },
        {
          response:
            'Inspection criteria are kept visible so teams can align workmanship, checkpoints, and acceptance language earlier.',
          title: 'Inspection criteria',
          whatItCovers:
            'The practical rules used to review incoming materials, in-process output, and finished goods.',
        },
        {
          response:
            'Document sets are organized around traceable checkpoints rather than one final summary created at the end.',
          title: 'Documentation traceability',
          whatItCovers:
            'How supporting notes, summaries, and request-based documents stay aligned to project milestones.',
        },
      ],
      title: 'Standards',
    },
    {
      items: [
        {
          response:
            'We support the collection and review of material-facing information needed for buyer or market-entry conversations.',
          title: 'Material declarations',
          whatItCovers:
            'Declarations or supporting references used to clarify what enters the product and how it is documented.',
        },
        {
          response:
            'Packaging and label content can be checked against customer-facing requirements before shipment leaves the factory.',
          title: 'Labeling and packaging review',
          whatItCovers:
            'Basic compliance-sensitive details that often need to be aligned before dispatch or channel launch.',
        },
        {
          response:
            'We structure summaries so sourcing and compliance teams can identify what is already documented and what remains project-specific.',
          title: 'Document readiness',
          whatItCovers:
            'The state of the supporting file set before a buyer requests deeper evidence or final approval materials.',
        },
      ],
      title: 'Compliance',
    },
    {
      items: [
        {
          response:
            'Validation discussions can be shaped around exposure conditions, use environment, and buyer-defined durability expectations.',
          title: 'Marine and outdoor exposure',
          whatItCovers:
            'Projects that need extra attention on corrosion, weather exposure, or longer-term use conditions.',
        },
        {
          response:
            'Performance reviews can be oriented around the intended load case, use pattern, and downstream safety expectations.',
          title: 'Transport and restraint expectations',
          whatItCovers:
            'Programs where application fit matters as much as general quality discipline.',
        },
        {
          response:
            'Documentation packs can be tailored to what a branded, distributor, or OEM program actually needs to launch cleanly.',
          title: 'Private label and OEM packout',
          whatItCovers:
            'Application-specific packaging, labeling, and buyer handoff requirements outside a one-size-fits-all file set.',
        },
      ],
      title: 'Application-specific requirements',
    },
  ] satisfies StandardsGroup[],
  testingStages: [
    {
      focus: 'Materials, components, trims, and buyer-critical inputs',
      outcome: 'Questionable inputs are caught before they move deeper into the run.',
      summary: 'The testing story starts before assembly, with checks on what enters the process.',
      title: 'Incoming material check',
    },
    {
      focus: 'Workmanship, dimensions, and consistency during the active production run',
      outcome: 'Problems surface earlier, when correction is still practical.',
      summary: 'Inspection during production helps reduce reliance on a single final checkpoint.',
      title: 'In-process inspection',
    },
    {
      focus: 'Project-relevant load, function, or performance expectations',
      outcome: 'Teams can review whether the product direction matches the use case before release.',
      summary: 'Performance review is framed around application-fit instead of generic claims.',
      title: 'Load and performance review',
    },
    {
      focus: 'Finished goods, labels, packout, and shipment-facing details',
      outcome: 'Final review confirms readiness before products move to dispatch.',
      summary: 'The closing inspection step checks both product and presentation details.',
      title: 'Final inspection',
    },
    {
      focus: 'Release notes, summary files, and buyer handoff materials',
      outcome: 'Documentation and product status stay aligned at the shipment stage.',
      summary: 'The process ends with release discipline, not just packed cartons.',
      title: 'Packout and release',
    },
  ] satisfies TestingStage[],
} as const
