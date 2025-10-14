import './Resources.css';

export default function Resources() {
  const localItems = [
    {
      title: "Society for Prevention of Cruelty to Animals (SPCA)",
      details: (
        <>
          Govt. Animal Shelter & Infirmary (Sector-38 West)<br/>
          Opp. Transport Depot, Daddu Majra Colony, Chandigarh, 160014<br/>
          📞 +91-172-2696450<br/>
          🕗 Mon–Sat: 9:30 am–5:30 pm; Sun: Closed
        </>
      )
    },
    {
      title: "Pet’s Mart Multi-Speciality Pet Hospital & Vet Lab",
      details: (
        <>
          #1155, Sector 21B, Chandigarh<br/>
          📞 +91-97805 27267, +91-93177 11155
        </>
      )
    },
    {
      title: "Tricity Pet Care & Pet Hospital",
      details: (
        <>
          Kochar Farms, Sector 13 (IT Park), Manimajra, Chandigarh<br/>
          📞 +91-99151 10604, +91-98555 01155
        </>
      )
    },
    {
      title: "Govt. Veterinary Hospital (Pet Animals)",
      details: (
        <>
          Sector-22, Chandigarh<br/>
          📞 +91-172-2700092
        </>
      )
    }
  ];

  const externalItems = [
    {
      title: "Petfinder Shelter Directory",
      description: "Search thousands of shelters & rescues nationwide.",
      url: "https://www.petfinder.com/animal-shelters-and-rescues/search/"
    },
    {
      title: "ASPCA Pet Care",
      description: "Expert articles on feeding, grooming & health.",
      url: "https://www.aspca.org/pet-care"
    },
    {
      title: "VolunteerMatch (Animal Causes)",
      description: "Find local & virtual volunteer opportunities.",
      url: "https://www.volunteermatch.org/search/?cats=30&l="
    },
    {
      title: "ASPCA Poison Control",
      description: "Immediate help if your pet eats something toxic.",
      url: "https://www.aspca.org/pet-care/aspca-poison-control"
    }
  ];

  return (
    <main className="container py-5">
      {/* Page Header */}
      <section className="resources-header">
        <h1>Resources & Support</h1>
        <p>
          Local clinics & shelters in Chandigarh, plus trusted national links.
        </p>
      </section>

      {/* Static Local Directory */}
      <section className="resources-directory">
        <h2>Chandigarh Directory</h2>
        <ul>
          {localItems.map(({ title, details }) => (
            <li key={title}>
              <h5>{title}</h5>
              <p>{details}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* External Live Links */}
      <section className="resources-links">
        <h2 className="text-center mb-4">More Resources</h2>
        <div className="row g-4">
          {externalItems.map(({ title, description, url }) => (
            <div key={title} className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column align-items-center text-center">
                  <div className="mb-3" style={{fontSize: '2.2rem'}}>
                    {title.includes('Petfinder') ? '🔎' : title.includes('ASPCA') ? '🐶' : title.includes('Volunteer') ? '🤝' : '📖'}
                  </div>
                  <h3 className="h6 mb-2" style={{color:'#e07a5f'}}>{title}</h3>
                  <p className="flex-grow-1 mb-3">{description}</p>
                  <a
                    href={url}
                    className="btn btn-outline-primary mt-auto px-4 py-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
