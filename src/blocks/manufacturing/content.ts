export const manufacturingMedia = {
  contact: {
    alt: 'Pioneers Gears contact and support team',
    position: 'center',
    url: 'https://cdn.pioneersgears.com/images/contact%20our%20team.webp',
  },
  detailA: {
    alt: 'Tie-down component detail prepared for production review',
    position: 'center',
    url: 'https://cdn.pioneersgears.com/images/PG_ARS01_1.webp',
  },
  detailB: {
    alt: 'Finished restraint system detail for validation and inspection',
    position: 'center',
    url: 'https://cdn.pioneersgears.com/images/PG_ARS01_9.webp',
  },
  operator: {
    alt: 'Production specialist reviewing a Pioneers Gears part',
    position: 'center',
    url: 'https://cdn.pioneersgears.com/images/Mario_Rom%C3%A1n_Serrano_pc.webp',
  },
  team: {
    alt: 'Pioneers Gears team on the workshop floor',
    position: '64% center',
    url: 'https://cdn.pioneersgears.com/images/Xiangle%20Team.webp',
  },
} as const

export const manufacturingOverviewContent = {
  eyebrow: 'Manufacturing overview',
  stats: [
    { label: 'Sampling and validation support', value: 'Fast' },
    { label: 'Production control across critical steps', value: 'Tracked' },
    { label: 'QC checkpoints built into the workflow', value: 'Multi' },
    { label: 'OEM / ODM customization support', value: 'Custom' },
  ],
  summary:
    'We structure manufacturing around repeatability, process control, and transparent communication so OEM and ODM customers can move from concept to delivery with fewer surprises.',
  title: 'Built for precision, repeatability, and scalable OEM/ODM production.',
} as const

export const manufacturingProcessContent = {
  eyebrow: 'Production process',
  steps: [
    {
      input: 'Application brief, target market, packaging and performance expectations',
      output: 'A clearer production path, risk review, and product direction',
      title: 'Requirement review',
      visual: manufacturingMedia.team,
    },
    {
      input: 'Target construction, material choices, dimensional and branding requirements',
      output: 'Sample or validation unit prepared for confirmation',
      title: 'Sampling & validation',
      visual: manufacturingMedia.detailB,
    },
    {
      input: 'Approved sample, materials, hardware, trims, packaging specs',
      output: 'Prepared inputs and organized production setup',
      title: 'Material preparation',
      visual: manufacturingMedia.operator,
    },
    {
      input: 'Controlled production instructions and approved components',
      output: 'Consistent manufacturing run aligned to the brief',
      title: 'Production',
      visual: manufacturingMedia.detailA,
    },
    {
      input: 'Ongoing in-process checks across workmanship and critical points',
      output: 'Issues identified early before they affect final delivery',
      title: 'In-process QC',
      visual: manufacturingMedia.contact,
    },
    {
      input: 'Final inspection criteria, packaging standards, shipment readiness review',
      output: 'Packed goods ready for dispatch with clearer quality assurance',
      title: 'Final inspection & packing',
      visual: manufacturingMedia.team,
    },
  ],
  title: 'A manufacturing flow designed to keep control visible from brief to finished shipment.',
} as const

export const manufacturingEquipmentContent = {
  eyebrow: 'Workshop & equipment visuals',
  items: [
    {
      description: 'Configured for precise strap and component preparation before assembly starts.',
      image: manufacturingMedia.detailA,
      title: 'Cutting & preparation',
    },
    {
      description: 'Focused workstations help maintain consistency during stitching and final assembly.',
      image: manufacturingMedia.operator,
      title: 'Sewing & assembly',
    },
    {
      description: 'Structured checks support product verification before items move downstream.',
      image: manufacturingMedia.detailB,
      title: 'Testing & validation',
    },
    {
      description: 'Production areas are organized to keep work visible, controlled, and easier to coordinate.',
      image: manufacturingMedia.team,
      title: 'Workshop coordination',
    },
    {
      description: 'Finished goods and shipping preparation stay aligned with the final inspection step.',
      image: manufacturingMedia.contact,
      title: 'Packing & dispatch',
    },
  ],
  title: 'The workshop is presented as a proof environment: visible, structured, and built around dependable execution.',
} as const

export const manufacturingQualityContent = {
  eyebrow: 'Quality control during production',
  items: [
    {
      body: 'Materials and components are checked against the project brief before they enter the run.',
      title: 'Incoming material check',
    },
    {
      body: 'In-process inspection helps catch issues during production instead of after the run is complete.',
      title: 'In-process inspection',
    },
    {
      body: 'Key performance and workmanship checks support confidence before final packing.',
      title: 'Load and performance review',
    },
    {
      body: 'Final inspection confirms packaging, labeling, and shipment readiness before dispatch.',
      title: 'Final packaging review',
    },
  ],
  title: 'Quality control is not a single final step. It is built into the production rhythm.',
} as const

export const manufacturingCapacityContent = {
  eyebrow: 'Capacity & production capability',
  items: [
    {
      label: 'Flexible project handling from prototype support to repeat production',
      value: 'Scaled',
    },
    {
      label: 'Manufacturing workflow aligned to OEM / ODM customization needs',
      value: 'OEM',
    },
    {
      label: 'Process checkpoints built to reduce preventable downstream issues',
      value: 'QC',
    },
    {
      label: 'Responsive coordination around product, packaging, and delivery requirements',
      value: 'Aligned',
    },
    {
      label: 'Capability suitable for custom tie-down and restraint-related programs',
      value: 'Focused',
    },
  ],
  title: 'Our capability story is about controlled execution, customization support, and dependable production communication.',
} as const

export const manufacturingOemOdmContent = {
  ctaHref: '/request-quote',
  ctaLabel: 'Start an OEM / ODM inquiry',
  eyebrow: 'OEM / ODM capability',
  oem: {
    points: [
      'Built around customer-defined specifications and requirements',
      'Supports consistent execution for branded or established product lines',
      'Best suited to buyers who already know their target construction and market needs',
    ],
    title: 'OEM production support',
  },
  odm: {
    points: [
      'Helps shape product direction from use case, positioning, and performance intent',
      'Supports sample-led refinement before broader production commitment',
      'Best suited to customers needing guidance from idea to final manufacturing path',
    ],
    title: 'ODM development support',
  },
  shared: ['Sampling', 'Specification review', 'Packaging support', 'Private label readiness'],
  title: 'We support both OEM clarity and ODM collaboration, depending on how defined the brief already is.',
} as const

export const manufacturingGalleryContent = {
  eyebrow: 'Factory gallery',
  items: [
    {
      caption: 'Team alignment around production activity and execution visibility.',
      image: manufacturingMedia.team,
      ratio: 'aspect-[4/5]',
      title: 'Workshop team view',
    },
    {
      caption: 'Close-up detail of finished restraint product components.',
      image: manufacturingMedia.detailA,
      ratio: 'aspect-[16/10]',
      title: 'Product detail',
    },
    {
      caption: 'Operator-level review helps keep workmanship close to the process.',
      image: manufacturingMedia.operator,
      ratio: 'aspect-[4/5]',
      title: 'Operator inspection',
    },
    {
      caption: 'Validated product detail prepared for inspection and downstream confirmation.',
      image: manufacturingMedia.detailB,
      ratio: 'aspect-[16/10]',
      title: 'Validation sample',
    },
    {
      caption: 'Support and coordination remain part of the manufacturing conversation.',
      image: manufacturingMedia.contact,
      ratio: 'aspect-[4/5]',
      title: 'Production coordination',
    },
    {
      caption: 'Broader workshop context reinforces process visibility and factory reality.',
      image: manufacturingMedia.team,
      ratio: 'aspect-[16/10]',
      title: 'Factory floor context',
    },
  ],
  title: 'A quick walk through the environment, details, and production moments behind the capability story.',
} as const

export const manufacturingInquiryContent = {
  primaryHref: '/request-quote',
  primaryLabel: 'Start an inquiry',
  secondaryHref: '/contact-us',
  secondaryLabel: 'Contact manufacturing team',
  summary:
    'If you need a manufacturing partner who can support OEM or ODM programs with more visible process control, we are ready to review the brief.',
  title: "Let's talk about the next manufacturing program, custom product line, or OEM / ODM project.",
} as const
