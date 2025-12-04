import "../App.css";

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">Contact Us</h1>

        <p className="contact-intro">
          Have questions or need assistance? Our team is ready to help you with enrollment, 
          account setup, or any technical concerns.
        </p>

        <div className="contact-section">
          <h2 className="contact-subtitle">Contact Information</h2>
          <p className="contact-info">
            <strong>Garcia College of Technology</strong>
          </p>
          <p className="contact-info">Roxas Avenue, Kalibo, Aklan</p>
          <p className="contact-info"><strong>Email:</strong> info@gct.edu.ph</p>
          <p className="contact-info"><strong>Phone:</strong> (036) 268-1234</p>
        </div>

        <div className="contact-section">
          <h2 className="contact-subtitle">Office Hours</h2>
          <p className="contact-info">Monday – Friday: 8:00 AM – 5:00 PM</p>
          <p className="contact-info">Saturday: 8:00 AM – 12:00 NN</p>
          <p className="contact-info">Closed on Sundays and Holidays</p>
        </div>

        <div className="contact-section">
          <h2 className="contact-subtitle">Technical Support</h2>
          <p className="contact-info">
            For technical issues with the enrollment system, please contact our IT support team 
            during office hours or email us at:
          </p>
          <p className="contact-info"><strong>Email:</strong> support@gct.edu.ph</p>
          <p className="contact-info"><strong>Phone:</strong> (036) 268-1235</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
