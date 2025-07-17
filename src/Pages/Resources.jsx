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
      <section className="text-center mb-4">
        <h1 className="display-5">Resources & Support</h1>
        <p className="text-muted">
          Local clinics & shelters in Chandigarh, plus trusted national links.
        </p>
      </section>

      {/* Static Local Directory */}
      <section className="mb-5">
        <h2 className="h4 mb-3">Chandigarh Directory</h2>
        <ul className="list-group">
          {localItems.map(({ title, details }) => (
            <li key={title} className="list-group-item">
              <h5 className="mb-1">{title}</h5>
              <p className="mb-0">{details}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* External Live Links */}
      <section>
        <h2 className="h4 text-center mb-4">More Resources</h2>
        <div className="row g-4">
          {externalItems.map(({ title, description, url }) => (
            <div key={title} className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h3 className="h6">{title}</h3>
                  <p className="flex-grow-1">{description}</p>
                  <a
                    href={url}
                    className="btn btn-outline-primary mt-auto"
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
