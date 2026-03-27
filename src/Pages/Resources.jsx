import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';

const directoryFilters = ['All', 'Shelter', 'Clinic', 'Government'];

const localItems = [
  {
    title: 'Society for Prevention of Cruelty to Animals (SPCA)',
    summary:
      'Government-backed shelter and infirmary support for intake, stabilization, and local rescue coordination.',
    area: 'Sector-38 West, Chandigarh',
    addressLines: [
      'Govt. Animal Shelter & Infirmary',
      'Opp. Transport Depot, Daddu Majra Colony, Chandigarh 160014',
    ],
    phoneNumbers: ['+91-172-2696450'],
    hours: 'Mon-Sat: 9:30 am-5:30 pm',
    hoursNote: 'Closed on Sunday',
    tags: ['Shelter', 'Government'],
    services: ['Shelter', 'Infirmary', 'Animal intake'],
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Govt%20Animal%20Shelter%20and%20Infirmary%20Sector-38%20West%20Chandigarh',
  },
  {
    title: "Pet's Mart Multi-Speciality Pet Hospital & Vet Lab",
    summary:
      'Multi-speciality hospital and vet lab support for consultations, diagnostics, and treatment.',
    area: 'Sector 21B, Chandigarh',
    addressLines: ['#1155, Sector 21B, Chandigarh'],
    phoneNumbers: ['+91-97805 27267', '+91-93177 11155'],
    tags: ['Clinic'],
    services: ['Hospital', 'Diagnostics', 'Consultation'],
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Pets%20Mart%20Multi-Speciality%20Pet%20Hospital%20Sector%2021B%20Chandigarh',
  },
  {
    title: 'Tricity Pet Care & Pet Hospital',
    summary:
      'Private pet hospital support for treatment, follow-up care, and general veterinary assistance.',
    area: 'Sector 13 (IT Park), Manimajra, Chandigarh',
    addressLines: [
      'Kochar Farms',
      'Sector 13 (IT Park), Manimajra, Chandigarh',
    ],
    phoneNumbers: ['+91-99151 10604', '+91-98555 01155'],
    tags: ['Clinic'],
    services: ['Hospital', 'Treatment', 'Follow-up'],
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Tricity%20Pet%20Care%20and%20Pet%20Hospital%20Manimajra%20Chandigarh',
  },
  {
    title: 'Govt. Veterinary Hospital (Pet Animals)',
    summary:
      'Government veterinary support for pet-animal consultations and general treatment needs.',
    area: 'Sector-22, Chandigarh',
    addressLines: ['Sector-22, Chandigarh'],
    phoneNumbers: ['+91-172-2700092'],
    tags: ['Clinic', 'Government'],
    services: ['Government clinic', 'Pet animals', 'Consultation'],
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Govt%20Veterinary%20Hospital%20Sector-22%20Chandigarh',
  },
];

const quickActions = [
  {
    eyebrow: 'Local help',
    title: 'Jump to the directory',
    description:
      'Search Chandigarh contacts by area or service and use direct call links when time matters.',
    href: '#local-directory',
    cta: 'Open directory',
  },
  {
    eyebrow: 'Reporting',
    title: 'Submit a sighting',
    description:
      'Log where you saw a stray or lost animal so others can respond with accurate location details.',
    to: '/sightings',
    cta: 'Report now',
  },
  {
    eyebrow: 'Adoption',
    title: 'Browse adoptable pets',
    description:
      'Move from support resources into adoption when you are ready to foster or adopt responsibly.',
    to: '/adopt',
    cta: 'View pets',
  },
];

const prepChecklist = [
  {
    title: 'Share the exact location',
    description:
      'Mention the sector, nearest landmark, and whether the animal is still there or moving.',
  },
  {
    title: 'Describe the condition clearly',
    description:
      'Call out visible injuries, limping, heavy bleeding, or unusual behavior so the response can be triaged.',
  },
  {
    title: 'Capture a photo if it is safe',
    description:
      'A quick photo helps identify size, color, collar details, and whether transport equipment is needed.',
  },
  {
    title: 'Call before you travel',
    description:
      'Clinic hours and intake capacity can change, so confirm availability before heading out.',
  },
];

const externalItems = [
  {
    title: 'Petfinder Shelter Directory',
    category: 'Directory',
    description:
      'Search rescue groups, shelters, and adoptable animals by location when you need options beyond the local list.',
    bestFor: 'Best for expanding your search radius.',
    url: 'https://www.petfinder.com/animal-shelters-and-rescues/search/',
  },
  {
    title: 'ASPCA Pet Care',
    category: 'Care guides',
    description:
      'Read practical guidance on feeding, grooming, behavior, and day-to-day health basics.',
    bestFor: 'Best for owner education and care routines.',
    url: 'https://www.aspca.org/pet-care',
  },
  {
    title: 'VolunteerMatch Animal Causes',
    category: 'Community',
    description:
      'Find local and virtual volunteer opportunities if you want to help shelters and rescues consistently.',
    bestFor: 'Best for volunteering and recurring support.',
    url: 'https://www.volunteermatch.org/search/?cats=30&l=',
  },
  {
    title: 'ASPCA Poison Control',
    category: 'Emergency',
    description:
      'Use this guide if a pet may have eaten or contacted something toxic and you need fast next-step context.',
    bestFor: 'Best for toxic exposure guidance.',
    url: 'https://www.aspca.org/pet-care/aspca-poison-control',
  },
];

function getPhoneHref(phoneNumber) {
  return `tel:${phoneNumber.replace(/[^+\d]/g, '')}`;
}

function matchesSearch(item, normalizedQuery) {
  if (!normalizedQuery) {
    return true;
  }

  const haystack = [
    item.title,
    item.summary,
    item.area,
    item.hours,
    item.hoursNote,
    item.addressLines.join(' '),
    item.tags.join(' '),
    item.services.join(' '),
    item.phoneNumbers.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = localItems.filter((item) => {
    const filterMatch =
      activeFilter === 'All' || item.tags.includes(activeFilter);

    return filterMatch && matchesSearch(item, normalizedQuery);
  });

  const hasActiveFilters = searchQuery.trim() || activeFilter !== 'All';
  const totalPhoneLines = localItems.reduce(
    (sum, item) => sum + item.phoneNumbers.length,
    0
  );

  return (
    <main className="resources-page">
      <div className="container py-5">
        <section className="resources-hero">
          <div className="resources-hero__content">
            <p className="resources-eyebrow">Support Hub</p>
            <h1>Resources & Support</h1>
            <p className="resources-hero__copy">
              One place for local Chandigarh contacts, quick next steps, and
              trusted guides when you need to act fast for an animal.
            </p>
            <div className="resources-hero__actions">
              <a className="resource-button resource-button--primary" href="#local-directory">
                Find local help
              </a>
              <Link className="resource-button resource-button--secondary" to="/sightings">
                Report a sighting
              </Link>
            </div>
          </div>

          <aside className="resources-hero__panel" aria-label="Immediate guidance">
            <p className="resources-panel__eyebrow">Immediate guidance</p>
            <h2>If time matters, start here</h2>
            <ul className="resources-priority-list">
              <li>
                <span className="resources-priority-list__marker">01</span>
                <span>Call ahead before transporting an injured or stressed animal.</span>
              </li>
              <li>
                <span className="resources-priority-list__marker">02</span>
                <span>Share the exact location, visible injuries, and whether the animal is mobile.</span>
              </li>
              <li>
                <span className="resources-priority-list__marker">03</span>
                <span>Use the directory below for direct local contacts and directions.</span>
              </li>
            </ul>
            <p className="resources-panel__note">
              Availability can change. Verify hours before visiting.
            </p>
          </aside>
        </section>

        <section className="resources-stats" aria-label="Resource overview">
          <article className="resources-stat">
            <span className="resources-stat__value">{localItems.length}</span>
            <span className="resources-stat__label">Local contacts</span>
          </article>
          <article className="resources-stat">
            <span className="resources-stat__value">{totalPhoneLines}</span>
            <span className="resources-stat__label">Direct phone lines</span>
          </article>
          <article className="resources-stat">
            <span className="resources-stat__value">{externalItems.length}</span>
            <span className="resources-stat__label">Trusted guide links</span>
          </article>
        </section>

        <section className="resources-actions" aria-labelledby="resource-actions-title">
          <div className="resources-section-heading">
            <div>
              <p className="resources-eyebrow resources-eyebrow--compact">Next steps</p>
              <h2 id="resource-actions-title">Pick the quickest route</h2>
            </div>
            <p>
              Move directly into the part of the app or directory that matches the situation.
            </p>
          </div>
          <div className="resources-action-grid">
            {quickActions.map(({ eyebrow, title, description, href, to, cta }) => {
              const content = (
                <>
                  <p className="resource-action-card__eyebrow">{eyebrow}</p>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="resource-action-card__cta">{cta}</span>
                </>
              );

              if (to) {
                return (
                  <Link key={title} className="resource-action-card" to={to}>
                    {content}
                  </Link>
                );
              }

              return (
                <a key={title} className="resource-action-card" href={href}>
                  {content}
                </a>
              );
            })}
          </div>
        </section>

        <section
          className="resources-directory-section"
          id="local-directory"
          aria-labelledby="resources-directory-title"
        >
          <div className="resources-section-heading">
            <div>
              <p className="resources-eyebrow resources-eyebrow--compact">Local directory</p>
              <h2 id="resources-directory-title">Chandigarh contacts</h2>
            </div>
            <p>
              Search by clinic, sector, government support, or service type.
            </p>
          </div>

          <div className="resources-controls">
            <label className="resources-search" htmlFor="resources-search">
              <span>Search directory</span>
              <input
                id="resources-search"
                type="search"
                placeholder="Try sector, shelter, government, lab..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>

            <div
              className="resources-filters"
              role="tablist"
              aria-label="Filter local resources"
            >
              {directoryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`resources-filter ${activeFilter === filter ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                className="resources-reset"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <p className="resources-results">
            Showing {filteredItems.length} of {localItems.length} local contacts.
          </p>

          {filteredItems.length ? (
            <div className="resources-card-grid">
              {filteredItems.map(
                ({
                  title,
                  summary,
                  area,
                  addressLines,
                  phoneNumbers,
                  hours,
                  hoursNote,
                  tags,
                  services,
                  mapUrl,
                }) => (
                  <article key={title} className="resource-card">
                    <div className="resource-card__top">
                      <div>
                        <p className="resource-card__area">{area}</p>
                        <h3>{title}</h3>
                      </div>
                      <div className="resource-card__badges">
                        {tags.map((tag) => (
                          <span key={tag} className="resource-badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="resource-card__summary">{summary}</p>

                    <div className="resource-card__details">
                      <div>
                        <p className="resource-card__label">Services</p>
                        <div className="resource-chip-list">
                          {services.map((service) => (
                            <span key={service} className="resource-chip">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="resource-card__label">Address</p>
                        <address className="resource-card__address">
                          {addressLines.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </address>
                      </div>

                      {hours ? (
                        <div>
                          <p className="resource-card__label">Hours</p>
                          <p className="resource-card__text">
                            {hours}
                            {hoursNote ? (
                              <span className="resource-card__subtext">{hoursNote}</span>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="resource-card__actions">
                      <div className="resource-card__phones">
                        {phoneNumbers.map((phoneNumber) => (
                          <a
                            key={phoneNumber}
                            className="resource-phone"
                            href={getPhoneHref(phoneNumber)}
                            aria-label={`Call ${title} at ${phoneNumber}`}
                          >
                            {phoneNumber}
                          </a>
                        ))}
                      </div>

                      <a
                        className="resource-text-link"
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get directions
                      </a>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="resources-empty" role="status">
              <h3>No local matches found</h3>
              <p>Try a sector name, a service like "clinic", or clear the current filters.</p>
            </div>
          )}
        </section>

        <section className="resources-prep" aria-labelledby="resources-prep-title">
          <div className="resources-section-heading">
            <div>
              <p className="resources-eyebrow resources-eyebrow--compact">Preparation</p>
              <h2 id="resources-prep-title">Before you call or visit</h2>
            </div>
            <p>
              A few details up front make the response faster and more accurate.
            </p>
          </div>
          <div className="resources-utility-grid">
            {prepChecklist.map(({ title, description }) => (
              <article key={title} className="resource-utility-card">
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="resources-links-section" aria-labelledby="resources-links-title">
          <div className="resources-section-heading">
            <div>
              <p className="resources-eyebrow resources-eyebrow--compact">Trusted links</p>
              <h2 id="resources-links-title">More resources</h2>
            </div>
            <p>
              National directories and reference guides for care, volunteering, and urgent context.
            </p>
          </div>
          <div className="resources-link-grid">
            {externalItems.map(({ title, category, description, bestFor, url }) => (
              <article key={title} className="resource-link-card">
                <p className="resource-link-card__category">{category}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                <p className="resource-link-card__bestfor">{bestFor}</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-text-link"
                >
                  Open resource
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
