import Link from 'next/link'
import React from 'react'

type KnowledgeTable = {
  caption?: string
  columns: readonly string[]
  rows: readonly (readonly React.ReactNode[])[]
}

const KnowledgeTable = ({ table }: { table: KnowledgeTable }) => {
  return (
    <div className="mt-6 overflow-x-auto border border-[#dce5dc] bg-[#f8faf7]">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm leading-6">
        {table.caption ? (
          <caption className="caption-top bg-white px-4 py-3 text-left text-sm font-semibold text-[#162019]">
            {table.caption}
          </caption>
        ) : null}
        <thead className="bg-[#eef4ed] text-[#162019]">
          <tr>
            {table.columns.map((column) => (
              <th
                className="border-b border-[#dce5dc] px-4 py-3 font-semibold"
                key={column}
                scope="col"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dce5dc] text-[#39483f]">
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  className="align-top px-4 py-4 first:font-semibold first:text-[#162019]"
                  key={`${rowIndex}-${cellIndex}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const applicationTable: KnowledgeTable = {
  caption: 'Application-based sourcing guide for tie-down and restraint products',
  columns: ['Application', 'Recommended products', 'Key buying focus', 'Factory customization'],
  rows: [
    [
      <Link
        className="text-[#294133] underline-offset-4 hover:underline"
        href="/product-categories/overlanding-and-off-road"
        key="overlanding-and-off-road"
      >
        Overlanding and off-road
      </Link>,
      'Recovery straps, ratchet straps, soft loops, gear straps, utility tie-down kits',
      'Abrasion resistance, hook security, webbing strength, outdoor storage durability',
      'Custom webbing color, reinforced stitching, logo labels, heavy-duty hooks, retail kits',
    ],
    [
      <Link
        className="text-[#294133] underline-offset-4 hover:underline"
        href="/product-categories/camping-and-outdoor"
        key="camping-and-outdoor"
      >
        Camping and outdoor
      </Link>,
      'Bungee cords, cam buckle straps, luggage straps, gear tie-downs, compact strap sets',
      'Easy handling, lightweight packaging, repeat retail SKUs, useful length assortment',
      'Private-label packaging, color-coded lengths, barcode support, multipack configuration',
    ],
    [
      <Link
        className="text-[#294133] underline-offset-4 hover:underline"
        href="/product-categories/marine-and-water-sports"
        key="marine-and-water-sports"
      >
        Marine and water sports
      </Link>,
      'Kayak tie-downs, canoe straps, boat trailer straps, stainless steel tie-down products',
      'Corrosion resistance, UV exposure, soft contact points, quick release handling',
      'Stainless or coated hardware options, protective sleeves, warning labels, custom cartons',
    ],
    [
      'Motorcycle and ATV restraint',
      'Motorcycle tie-down straps, cam buckle straps, soft loops, wheel restraint straps',
      'Stable tension, paint protection, compact storage, hook geometry, paired sets',
      'Branded sleeves, sewn-in labels, retail-ready pair packs, custom hook and buckle choices',
    ],
    [
      'General cargo and utility',
      'Ratchet straps, cam buckle straps, bungee cords, tie-down kits, cargo nets',
      'Working load range, strap length, everyday usability, clear product labeling',
      'SKU planning, carton marks, instructions, display packaging, OEM assortment planning',
    ],
  ],
}

const materialTable: KnowledgeTable = {
  caption: 'Common material and hardware choices for OEM tie-down product development',
  columns: ['Component', 'Common choice', 'Best used for', 'Buyer note'],
  rows: [
    [
      'Polyester webbing',
      'Low-stretch woven webbing',
      'Ratchet straps, cam buckle straps, motorcycle tie-downs, marine straps',
      'A practical default when buyers need strength, dimensional stability, and outdoor use.',
    ],
    [
      'Nylon webbing',
      'More elastic synthetic webbing',
      'Tow and recovery products where controlled stretch may be useful',
      'Confirm application carefully because stretch behavior is different from cargo tie-down webbing.',
    ],
    [
      'Elastic cord',
      'Latex or rubber core with woven jacket',
      'Bungee cords, luggage restraint, camping and utility products',
      'Specify cord diameter, hook type, jacket color, stretch target, and retail pack style.',
    ],
    [
      'Steel hardware',
      'Ratchets, cam buckles, S hooks, J hooks, snap hooks, flat hooks',
      'Most cargo control and transport products',
      'Coating, thickness, spring quality, and hook geometry can change product feel and service life.',
    ],
    [
      'Stainless or corrosion-resistant hardware',
      'Stainless steel or coated fittings',
      'Marine, water sports, outdoor storage, humid environments',
      'Use when corrosion resistance is a selling point, not only when strength is the only concern.',
    ],
    [
      'Protective parts',
      'Sleeves, pads, soft loops, edge guards',
      'Motorcycle, kayak, canoe, painted equipment, delicate cargo',
      'Small accessories can increase perceived value and reduce avoidable webbing damage.',
    ],
  ],
}

const factoryTable: KnowledgeTable = {
  caption: 'What direct-factory sourcing should clarify before quotation',
  columns: ['Decision area', 'What to define', 'Why it matters for real orders'],
  rows: [
    [
      'Product specification',
      'Product type, length, width, webbing or cord material, hook, buckle, WLL target if applicable',
      'Turns a broad product request into a workable quotation and a repeatable production spec.',
    ],
    [
      'Branding',
      'Logo label, printed webbing, custom color, instruction card, warning label, packaging artwork',
      'Helps private-label buyers compare factory capability beyond the unit price.',
    ],
    [
      'Packaging',
      'Polybag, header card, blister, color box, carton quantity, barcode, Amazon or retail needs',
      'Packaging affects MOQ, sample timing, carton volume, product presentation, and repeat ordering.',
    ],
    [
      'Quality review',
      'Sample approval, stitching review, hardware check, load-focused inspection, production consistency',
      'Separates a direct OEM factory program from simple trading or spot purchasing.',
    ],
    [
      'Market and use case',
      'Outdoor, marine, overlanding, motorcycle, utility cargo, industrial supply, promotional retail',
      'Allows the factory to recommend practical product construction instead of a generic strap.',
    ],
  ],
}

export const ProductIndustryKnowledge = () => {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container">
        <article className="border-y border-[#dce5dc] py-8 text-[#39483f]">
          <div className="max-w-5xl">
            <h2 className="font-display text-3xl leading-tight text-[#162019] md:text-4xl">
              Products Industry Knowledge: Tie-Down Straps, Bungee Cords and OEM Cargo Control
            </h2>
            <p className="mt-5 text-base leading-8">
              PioneersGears manufactures tie-down straps, bungee cords, marine tie-downs, motorcycle
              restraints, recovery straps, utility straps, and private-label cargo control products
              for brands, distributors, outdoor retailers, marine suppliers, and OEM buyers. Our
              direct factory work covers product structure, webbing and cord selection, hardware
              matching, sewing, assembly, packaging, sample review, and repeat production, so
              professional buyers can compare each product family by application instead of judging
              only by photos or unit price.
            </p>
          </div>

          <nav aria-label="Products industry knowledge sections" className="mt-8 bg-[#f8faf7] p-5">
            <h3 className="text-base font-semibold text-[#162019]">Buyer guide</h3>
            <ol className="mt-4 grid gap-2 text-sm leading-6 text-[#4f5f55] md:grid-cols-2">
              <li>
                <a className="hover:text-[#294133]" href="#choose-by-application">
                  1. Choose products by application
                </a>
              </li>
              <li>
                <a className="hover:text-[#294133]" href="#product-types">
                  2. Compare main tie-down product types
                </a>
              </li>
              <li>
                <a className="hover:text-[#294133]" href="#materials-hardware">
                  3. Select materials and hardware
                </a>
              </li>
              <li>
                <a className="hover:text-[#294133]" href="#load-safety">
                  4. Understand WLL, break strength and safety
                </a>
              </li>
              <li>
                <a className="hover:text-[#294133]" href="#direct-factory">
                  5. Evaluate direct factory OEM advantages
                </a>
              </li>
              <li>
                <a className="hover:text-[#294133]" href="#buyer-checklist">
                  6. Prepare an OEM inquiry checklist
                </a>
              </li>
            </ol>
          </nav>

          <section className="mt-10 border-t border-[#dce5dc] pt-9" id="choose-by-application">
            <h3 className="font-display text-2xl leading-tight text-[#162019]">
              How to choose tie-down products by application
            </h3>
            <p className="mt-5 text-base leading-8">
              Buyers comparing product families are usually trying to solve a practical sourcing
              problem: <strong>ratchet straps vs. cam buckle straps</strong>,{' '}
              <strong>bungee cords for outdoor gear</strong>,{' '}
              <strong>kayak and canoe tie-downs</strong>,{' '}
              <strong>motorcycle tie-down straps</strong>, and{' '}
              <strong>custom cargo restraint products</strong> all point to different end users,
              loads, environments, packaging channels, and risk points.
            </p>
            <KnowledgeTable table={applicationTable} />

            <div className="mt-9 space-y-9">
              <section className="bg-[#f8faf7] p-5 md:p-6">
                <h4 className="text-xl font-semibold text-[#162019]">
                  Overlanding and off-road tie-down products
                </h4>
                <p className="mt-3 text-base leading-8">
                  Overlanding buyers care about reliability in rough outdoor conditions. Products
                  are often stored in a vehicle, exposed to dust, moisture, UV, vibration, and
                  repeated handling. A low-cost strap may look acceptable in a product photo, but
                  the real value is in <strong>abrasion-resistant webbing</strong>, secure hook
                  geometry, reinforced sewing, and hardware that does not feel flimsy under tension.
                </p>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                      Product direction
                    </h5>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                      <li>Ratchet straps for trailers, roof racks, and cargo platforms.</li>
                      <li>Recovery straps and tow straps for off-road support kits.</li>
                      <li>
                        Soft loops and protective sleeves for painted or shaped anchor points.
                      </li>
                      <li>Gear straps for traction boards, boxes, cans, and camp equipment.</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                      Factory advantage
                    </h5>
                    <p className="mt-3 text-sm leading-6">
                      A direct factory can build a complete outdoor restraint program around the
                      same brand language: matching colors, webbing width, labels, retail kits,
                      carton marks, and repeatable hardware choices across multiple SKUs.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-[#f8faf7] p-5 md:p-6">
                <h4 className="text-xl font-semibold text-[#162019]">
                  Camping, outdoor and utility strap assortments
                </h4>
                <p className="mt-3 text-base leading-8">
                  Camping and outdoor products are often sold as convenient, affordable, and
                  easy-to-understand accessories. The key is not only strength; it is how quickly an
                  end user can choose the right length, attach it, remove it, store it, and buy it
                  again. <strong>Bungee cords</strong>, <strong>cam buckle straps</strong>,{' '}
                  <strong>luggage straps</strong>, and <strong>compact tie-down kits</strong> work
                  well in private-label assortments when the length system, color coding, and
                  packaging are easy for shoppers to understand.
                </p>
                <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-6">
                  <li>
                    Define the retail use: camping storage, roof rack loading, luggage restraint,
                    household utility, or promotional outdoor kit.
                  </li>
                  <li>
                    Build a clear size system: color-coded lengths, multipacks, hook styles, and
                    simple instruction cards.
                  </li>
                  <li>
                    Treat packaging as part of the product: header cards, hangtags, color boxes,
                    barcodes, carton quantity, and shelf presentation.
                  </li>
                </ol>
              </section>

              <section className="bg-[#f8faf7] p-5 md:p-6">
                <h4 className="text-xl font-semibold text-[#162019]">
                  Marine and water sports tie-down products
                </h4>
                <p className="mt-3 text-base leading-8">
                  Marine buyers are sensitive to corrosion, wet handling, UV exposure, and damage to
                  kayaks, canoes, boards, and boat surfaces. For this category, product development
                  should focus on <strong>soft contact</strong>,{' '}
                  <strong>corrosion-resistant hardware</strong>, neat webbing edges, clear warning
                  labels, and quick operation with wet hands.
                </p>
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                      Kayak and canoe
                    </h5>
                    <p className="mt-3 text-sm leading-6">
                      Cam buckle straps, bow and stern tie-downs, soft sleeves, and compact storage
                      straps help protect hulls and simplify loading.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                      Boat trailer
                    </h5>
                    <p className="mt-3 text-sm leading-6">
                      Trailer straps need practical hook selection, stable tension, and packaging
                      that clearly communicates size, quantity, and intended use.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                      OEM details
                    </h5>
                    <p className="mt-3 text-sm leading-6">
                      Stainless or coated hardware, UV-resistant webbing direction, branded sleeves,
                      and waterproof instruction cards can make the line feel purpose-built.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-[#f8faf7] p-5 md:p-6">
                <h4 className="text-xl font-semibold text-[#162019]">
                  Motorcycle and ATV restraint products
                </h4>
                <p className="mt-3 text-base leading-8">
                  Motorcycle tie-down products must balance holding power with surface protection.
                  The buyer is not only asking whether the strap is strong; they are asking whether
                  the hooks seat correctly, whether the webbing routes cleanly, whether soft loops
                  protect bars and frames, and whether a paired set feels trustworthy enough for a
                  valuable vehicle.
                </p>
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6">
                  <li>
                    <strong>Cam buckle straps</strong> can work for lighter, controlled restraint
                    where quick adjustment is important.
                  </li>
                  <li>
                    <strong>Ratchet straps</strong> are useful when buyers need stronger tension,
                    but product instructions should warn against overtightening.
                  </li>
                  <li>
                    <strong>Soft loops, sleeves, and coated hooks</strong> help reduce contact
                    damage and improve perceived product quality.
                  </li>
                </ul>
              </section>

              <section className="bg-[#f8faf7] p-5 md:p-6">
                <h4 className="text-xl font-semibold text-[#162019]">
                  General cargo, retail kits and everyday utility products
                </h4>
                <p className="mt-3 text-base leading-8">
                  General cargo products usually compete in crowded retail and online channels, so
                  clarity matters. Buyers need a product that is easy to compare, easy to explain,
                  and easy to reorder. A direct factory can help design a family of SKUs around
                  strap width, length, rated use, hook type, package quantity, and channel-specific
                  presentation.
                </p>
                <h5 className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                  Practical assortment plan
                </h5>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
                  <li>Entry-level utility straps for light household and outdoor organization.</li>
                  <li>Standard ratchet straps and cam buckle straps for trailer and cargo use.</li>
                  <li>
                    Specialty kits with hooks, soft loops, sleeves, storage bags, or instructions.
                  </li>
                  <li>
                    Retail-ready packs with barcode, warning label, carton mark, and brand artwork.
                  </li>
                </ol>
              </section>
            </div>
          </section>

          <section className="mt-10 border-t border-[#dce5dc] pt-9" id="product-types">
            <h3 className="font-display text-2xl leading-tight text-[#162019]">
              Main types of tie-down and restraint products
            </h3>
            <p className="mt-5 text-base leading-8">
              Buyers often use similar words for different products: cargo straps, lashing straps,
              tie-down straps, utility straps, bungee cords, motorcycle straps, and boat straps. A
              direct factory should help turn those common product names into precise
              specifications.
            </p>

            <div className="mt-7 grid gap-7 lg:grid-cols-2">
              <section>
                <h4 className="text-xl font-semibold text-[#162019]">Ratchet straps</h4>
                <p className="mt-3 text-base leading-7">
                  Ratchet straps are the right starting point when the buyer needs controlled
                  mechanical tension, stronger holding power, and a secure locking mechanism. They
                  are commonly used for trailers, outdoor equipment, vehicle transport, overlanding
                  gear, and general cargo.
                </p>
                <h5 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                  Specification focus
                </h5>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                  <li>Webbing width, length, color, thickness, and edge finish.</li>
                  <li>Ratchet handle size, release feel, gear quality, and coating option.</li>
                  <li>Hook type, warning label, working load label, and retail pack format.</li>
                </ul>
              </section>

              <section>
                <h4 className="text-xl font-semibold text-[#162019]">Cam buckle straps</h4>
                <p className="mt-3 text-base leading-7">
                  Cam buckle straps are useful where quick handling and lower risk of overtightening
                  matter more than maximum tension. They are popular for kayaks, canoes,
                  motorcycles, lightweight cargo, roof racks, and camping equipment.
                </p>
                <h5 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#36513f]">
                  Product development notes
                </h5>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                  <li>Confirm buckle grip, webbing thickness, and release feel.</li>
                  <li>Add soft loops or sleeves for painted and delicate surfaces.</li>
                  <li>Plan paired retail packs for kayak, motorcycle, and outdoor buyers.</li>
                </ul>
              </section>

              <section>
                <h4 className="text-xl font-semibold text-[#162019]">Bungee cords</h4>
                <p className="mt-3 text-base leading-7">
                  Bungee cords are not a replacement for rated cargo securement, but they are
                  extremely useful for outdoor gear organization, camping storage, luggage
                  restraint, roof rack accessories, and promotional utility kits. The important
                  decisions are cord diameter, stretch target, hook style, jacket color, and
                  packaging.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-semibold text-[#162019]">
                  Marine, motorcycle and specialty straps
                </h4>
                <p className="mt-3 text-base leading-7">
                  Specialty straps should solve a specific use problem: corrosion resistance for
                  marine use, soft contact for motorcycles, compact storage for camping, or rugged
                  hardware for off-road gear. Professional buyers usually evaluate these products by
                  application first, then compare strap type, hardware, packaging, and repeat order
                  consistency.
                </p>
              </section>
            </div>
          </section>

          <section className="mt-10 border-t border-[#dce5dc] pt-9" id="materials-hardware">
            <h3 className="font-display text-2xl leading-tight text-[#162019]">
              Material and hardware selection guide
            </h3>
            <p className="mt-5 text-base leading-8">
              A product that looks similar in a catalog can perform very differently in the field.
              Webbing material, elastic cord quality, hook shape, ratchet handle, buckle spring,
              stitching pattern, protective sleeve, and label quality all affect how the finished
              product feels and how confidently buyers can sell it.
            </p>
            <KnowledgeTable table={materialTable} />
          </section>

          <section className="mt-10 border-t border-[#dce5dc] pt-9" id="load-safety">
            <h3 className="font-display text-2xl leading-tight text-[#162019]">
              Working load, breaking strength and practical safety basics
            </h3>
            <p className="mt-5 text-base leading-8">
              For cargo control products, buyers should separate <strong>working load limit</strong>
              , <strong>breaking strength</strong>, and <strong>real use conditions</strong>. In
              regulated transport, rules such as FMCSA cargo securement requirements focus on secure
              attachment, working load limits, edge protection, and the minimum number of tiedowns.
              Product labels and local regulations should always guide final use.
            </p>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-8">
              <li>
                <strong>Do not buy only by width.</strong> Two straps with the same width may use
                different webbing, hardware, stitching, and rated capacity.
              </li>
              <li>
                <strong>Match the product to the anchor point.</strong> Hook style, fitting
                geometry, and pull direction affect whether a strap works cleanly.
              </li>
              <li>
                <strong>Protect the webbing from sharp edges.</strong> Edge guards, sleeves, and
                correct routing help reduce abrasion and cutting risk.
              </li>
              <li>
                <strong>Inspect before use.</strong> Webbing cuts, broken stitching, corrosion, bent
                hooks, damaged ratchets, or missing labels are warning signs.
              </li>
            </ol>
          </section>

          <section className="mt-10 border-t border-[#dce5dc] pt-9" id="direct-factory">
            <h3 className="font-display text-2xl leading-tight text-[#162019]">
              Why direct factory sourcing matters for OEM and private-label buyers
            </h3>
            <p className="mt-5 text-base leading-8">
              PioneersGears is positioned for buyers who need more than a one-time product quote. As
              a direct factory team with <strong>16+ years of experience</strong>, an
              <strong> 8,000 square meter factory area</strong>, <strong>60+ workshop staff</strong>
              , and large-scale daily production capacity, we can support repeatable OEM/ODM
              tie-down programs for brands, distributors, outdoor retailers, marine suppliers, and
              private-label cargo control buyers.
            </p>
            <KnowledgeTable table={factoryTable} />
            <h4 className="mt-7 text-xl font-semibold text-[#162019]">
              Factory advantages buyers should look for
            </h4>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-8">
              <li>
                <strong>Application review:</strong> discussion around real use, load direction,
                storage environment, retail channel, and end customer.
              </li>
              <li>
                <strong>Sample development:</strong> confirmation of webbing, elastic cord,
                stitching, hardware, label, packaging, and product set configuration before bulk
                production.
              </li>
              <li>
                <strong>Production consistency:</strong> repeatable cutting, sewing, assembly,
                inspection, carton packing, and export communication.
              </li>
              <li>
                <strong>Private-label support:</strong> custom colors, logo labels, barcode
                planning, instruction cards, retail packaging, cartons, and SKU assortments.
              </li>
            </ul>
          </section>

          <section className="mt-10 border-t border-[#dce5dc] pt-9" id="buyer-checklist">
            <h3 className="font-display text-2xl leading-tight text-[#162019]">
              OEM buyer checklist before requesting a quote
            </h3>
            <p className="mt-5 text-base leading-8">
              The fastest way to get useful pricing is to turn a broad product idea into a
              production-ready brief. Before sending an inquiry for custom tie-down straps, bungee
              cords, marine tie-downs, motorcycle restraints, or cargo control kits, prepare the
              following details.
            </p>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-8">
              <li>
                <strong>Product family:</strong> ratchet strap, cam buckle strap, bungee cord, kayak
                strap, motorcycle tie-down, recovery strap, or complete tie-down kit.
              </li>
              <li>
                <strong>Size and construction:</strong> length, width, material, hook, buckle,
                stitching direction, sleeves, and label requirements.
              </li>
              <li>
                <strong>Application:</strong> overlanding, camping, marine, motorcycle, utility
                cargo, trailer use, retail promotion, or industrial supply.
              </li>
              <li>
                <strong>Branding and packaging:</strong> logo, color, label, hangtag, blister, color
                box, carton quantity, barcode, and market language.
              </li>
              <li>
                <strong>Commercial plan:</strong> target quantity, sample needs, launch timing,
                destination market, inspection expectations, and repeat order plan.
              </li>
            </ol>
          </section>
        </article>
      </div>
    </section>
  )
}
