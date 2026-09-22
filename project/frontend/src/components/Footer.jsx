const Footer = () => {
  return (
    <footer style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center', marginTop: 'auto' }}>
      <div>
        <p>&copy; {new Date().getFullYear()} Home Appliance Comparison and Buying Guide. All rights reserved.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
