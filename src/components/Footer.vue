<template>
  <footer class="footer">
    <div class="footer-wave"></div>
    <div class="container footer-content">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo inverted">
            <div class="logo-placeholder">B</div>
            <span class="logo-text">Bookmarko</span>
          </div>
          <p class="brand-tagline">Your personal library for the digital age. Save what matters, forget the rest.</p>
        </div>
        
        <div class="footer-links-group">
          <h3>Product</h3>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Integrations</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>
        
        <div class="footer-links-group">
          <h3>Company</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        
        <div class="footer-links-group">
          <h3>Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 Bookmarko Inc. Built with love for readers.</p>
        <div class="social-links">
          <a href="#" aria-label="Twitter">Twitter</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--primary);
  color: white;
  position: relative;
  padding-top: 6rem;
  padding-bottom: 3rem;
  margin-top: 10rem;
  border-top-left-radius: 4rem;
  border-top-right-radius: 4rem;
}

.footer-content {
  position: relative;
  z-index: 2;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.footer-brand .logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.footer-brand .logo-placeholder {
  background-color: white;
  color: var(--primary);
}

.brand-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  max-width: 300px;
}

.footer-links-group h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.footer-links-group ul {
  list-style: none;
}

.footer-links-group li {
  margin-bottom: 0.75rem;
}

.footer-links-group a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.footer-links-group a:hover {
  color: white;
  padding-left: 5px;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000000;
  font-size: 0.875rem;
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-links a {
  color: #000000;
  text-decoration: none;
  transition: var(--transition);
}

.social-links a:hover {
  color: white;
}

.logo-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.25rem;
  font-weight: 800;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .footer-brand {
    grid-column: span 2;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}
</style>
