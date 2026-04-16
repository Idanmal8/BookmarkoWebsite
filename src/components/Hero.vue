<template>
  <section class="hero">
    <div class="container hero-content">
      <div class="hero-text-area">
        <h1 class="animate-up">Save your wisdom like writing in <span class="accent">Apple Notes.</span></h1>
        <p class="animate-up delay-1">Bookmarko seamlessly captures links, annotations, and thoughts. The ultimate home for your digital reading experience.</p>
        
        <div class="waitlist-form animate-up delay-2">
          <div class="input-group">
            <input 
              v-model="email" 
              type="email" 
              placeholder="Enter your email" 
              class="input-field"
              :disabled="isSubmitting"
            />
            <button 
              class="btn-primary" 
              @click="handleJoin" 
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Joining...' : 'Join Waitlist' }}
            </button>
          </div>
          <p class="sub-text">No credit card required</p>
          
          <div class="newsletter-option">
            <label class="checkbox-container">
              <input v-model="subscribeNewsletter" type="checkbox" />
              <span class="checkmark"></span>
              Sign in to the newsletter also
            </label>
          </div>
          
          <p v-if="submitted" class="success-msg">Thanks for joining! We'll be in touch soon.</p>
        </div>
      </div>
      
      <div class="hero-image-area animate-fade-in delay-1">
        <div class="mockup-container">
          <!-- Placeholder for the video/mockup -->
          <div class="mockup-inner">
            <div class="video-placeholder">
              <div class="play-btn">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="mockup-shadow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWaitlistStore } from '@/stores/waitlist';

const email = ref('');
const subscribeNewsletter = ref(true);
const isSubmitting = ref(false);
const submitted = ref(false);

const store = useWaitlistStore();

const handleJoin = async () => {
  if (!email.value || !email.value.includes('@')) {
    alert('Please enter a valid email');
    return;
  }
  
  isSubmitting.value = true;
  const result = await store.joinWaitlist(email.value, subscribeNewsletter.value);
  isSubmitting.value = false;
  
  if (result.success) {
    submitted.value = true;
    email.value = '';
  } else {
    alert(store.error || 'Something went wrong. Please try again.');
  }
};
</script>

<style scoped>
.hero {
  padding-top: 10rem;
  padding-bottom: 8rem;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text-area {
  max-width: 600px;
}

.accent {
  color: var(--primary);
}

.waitlist-form {
  margin-top: 3rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group .input-field {
  flex: 1;
}

.newsletter-option {
  margin-bottom: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #eee;
  border-radius: 6px;
  transition: var(--transition);
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.success-msg {
  color: #10b981;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
}

.sub-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: -0.5rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.mockup-container {
  position: relative;
  padding: 1rem;
}

.mockup-inner {
  position: relative;
  z-index: 2;
  border-radius: 2.5rem;
  background: var(--white);
  padding: 0.75rem;
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.12);
  border: 4px solid #111;
  aspect-ratio: 9 / 19;
  max-width: 320px;
  margin: 0 auto;
  overflow: hidden;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.play-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.mockup-shadow {
  position: absolute;
  bottom: -20px;
  left: 10%;
  right: 10%;
  height: 40px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%);
  z-index: 1;
}

/* Animations */
.animate-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s forwards ease-out;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1.2s forwards ease-out;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-text-area {
    margin: 0 auto;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .checkbox-container {
    justify-content: center;
  }
}
</style>
