import "../App.css";

function Visit() {
  const googleMapsUrl = "https://www.google.com/maps/@11.6927711,122.3669387,17z?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D";
  
  return (
    <div >
      <div className="visit-content">
        <h1 className="visit-title">GCT Online Enrolment</h1>

        <p className="visit-intro">
          Experience the learning environment at <strong>Garcia College of Technology!</strong> 
          We welcome students, parents, and visitors to explore our campus and discover what 
          makes GCT a great place to study and grow.
        </p>

        <div className="visit-section">
          <h2 className="visit-subtitle">Get Enrolled now!</h2>
          <p className="visit-text">
            Explore the learning environment at <strong>Garcia College of Technology!</strong> 
            We welcome students, parents, and visitors to explore our campus and discover what 
            makes GCT a great place to study and grow.
          </p>
        </div>

        <div className="visit-section">
          <h2 className="visit-subtitle">Campus Location</h2>
          <ul className="location-list">
            <li>Estancia, Kalibo, Aklan, Philippines</li>
          </ul>
          
          {/* Google Maps Link */}
          <div className="google-maps-link-container">
            <a 
              href={googleMapsUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="google-maps-link"
            >
              <span className="map-icon">📍</span>
              View Campus Location on Google Maps
            </a>
            <p className="map-instruction">
              Click the link above to open Google Maps in a new window
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Visit;
