<template>
  <footer class="footer">
    <div class="footer-wave"></div>
    <div class="container footer-content">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo inverted">
            <img src="/src/assets/bookmarkoLogo.png" alt="Bookmarko Logo" class="logo-image" />
            <span class="logo-text">Bookmarko</span>
          </div>
          <p class="brand-tagline">Because your brain deserves better than 100 open tabs. Your digital sanctuary for great reads. 🚀✨</p>
        </div>
        
        <div class="footer-links-group" v-if="false">
          <!-- Hidden per user request -->
          <h3>Product</h3>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Integrations</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>
        
        <div class="footer-links-group" v-if="false">
          <!-- Hidden per user request -->
          <h3>Company</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        
        <div class="footer-links-group">
          <h3>Legal</h3>
          <ul>
            <li><a href="/privacy.html">Privacy Policy</a></li>
            <li><a href="/terms.html">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="footer-bottom-text">&copy; 2026 Bookmarko Inc. Built with love for readers.</p>
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
  /* Increased border opacity so the line is actually visible */
  border-top: 1px solid rgba(255, 255, 255, 0.3); 
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  /* Force white and improve readability */
  color: #FFFFFF !important; 
  font-weight: 600;
  font-size: 0.9rem;
  
  /* This helps text stand out against vibrant backgrounds */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.footer-bottom-text {
  color: #FFFFFF;
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

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
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
