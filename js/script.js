// JavaScript for interactive features

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    // Open mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// Gallery filtering functionality
document.addEventListener('DOMContentLoaded', () => {
    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        // Set default view to show only "main" (Team & Research) items
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === 'main') {
                item.classList.remove('hidden');
                item.style.display = 'block';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Gallery item click for fullscreen modal
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let currentImages = [];
    
    function updateCurrentImages() {
        currentImages = Array.from(galleryItems).filter(item => {
            return item.style.display !== 'none' && !item.classList.contains('hidden');
        });
    }
    
    function showModal(index) {
        updateCurrentImages();
        if (index >= 0 && index < currentImages.length) {
            currentImageIndex = index;
            const item = currentImages[index];
            const img = item.querySelector('img');
            
            // Get custom title and description from data attributes
            const customTitle = item.getAttribute('data-title');
            const customDescription = item.getAttribute('data-description');
            
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalTitle.textContent = customTitle || ''; // Use custom title or empty
            modalDescription.textContent = customDescription || ''; // Use custom description or empty
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function getImageDescription(alt) {
        // Return empty string - user will add custom descriptions
        return '';
    }
    
    function showNextImage() {
        const nextIndex = (currentImageIndex + 1) % currentImages.length;
        showModal(nextIndex);
    }
    
    function showPrevImage() {
        const prevIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        showModal(prevIndex);
    }
    
    // Add click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateCurrentImages();
            const visibleIndex = currentImages.indexOf(item);
            if (visibleIndex !== -1) {
                showModal(visibleIndex);
            }
        });
    });
    
    // Modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                hideModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const statusDiv = form.querySelector('#form-status');
    
    // Get form data
    const formData = new FormData(form);
    const countryCode = formData.get('country-code') || '+61';
    const phoneNumber = formData.get('phone');
    
    // Validate phone number - only numbers allowed
    if (phoneNumber && !/^[0-9]+$/.test(phoneNumber.trim())) {
        statusDiv.style.display = 'block';
        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = '❌ Please enter only numbers for the phone number (no spaces, dashes, or letters).';
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    const fullPhone = phoneNumber ? `${countryCode} ${phoneNumber}` : 'Not provided';
    
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        title: formData.get('title'),
        phone: fullPhone,
        message: formData.get('message')
    };
    
    // Validate required fields
    if (!contactData.email || !contactData.email.trim()) {
        statusDiv.style.display = 'block';
        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = '❌ Email address is required.';
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    if (!contactData.name || !contactData.name.trim()) {
        statusDiv.style.display = 'block';
        statusDiv.className = 'form-status error';
        statusDiv.innerHTML = '❌ Name is required.';
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    console.log('📝 Form data collected:', contactData);
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    statusDiv.style.display = 'block';
    statusDiv.className = 'form-status loading';
    statusDiv.textContent = 'Sending your message...';
    
    try {
        let firebaseSuccess = false;
        let emailJSSuccess = false;
        let submissionId = null;
        
        // Try Firebase method first (save to database)
        try {
            const { handleContactForm } = await import('./firebase-config.js');
            const result = await handleContactForm(contactData);
            
            if (result.success) {
                firebaseSuccess = true;
                submissionId = result.submissionId;
                console.log('✅ Firebase save successful:', submissionId);
            }
        } catch (firebaseError) {
            console.log('Firebase method failed:', firebaseError);
        }
        
        // Try EmailJS method (send email notification)
        try {
            console.log('🔍 Checking EmailJS availability...');
            console.log('- typeof emailjs:', typeof emailjs);
            console.log('- window.emailJSHandler:', !!window.emailJSHandler);
            
            if (typeof emailjs === 'undefined') {
                console.error('❌ EmailJS library not loaded');
                throw new Error('EmailJS library not available');
            }
            
            if (window.emailJSHandler) {
                console.log('📧 Attempting to send EmailJS notification...');
                const emailResult = await window.emailJSHandler.sendNotification(contactData);
                console.log('✅ EmailJS result:', emailResult);
                
                // Check if the result indicates success
                if (emailResult && emailResult.success) {
                    emailJSSuccess = true;
                    console.log('✅ EmailJS notification sent successfully');
                } else {
                    console.log('⚠️ EmailJS returned but without success flag, trying fallback...');
                    throw new Error('EmailJS returned without success flag');
                }
            } else {
                console.error('❌ EmailJS handler not found on window object');
                throw new Error('EmailJS handler not initialized');
            }
        } catch (emailError) {
            console.error('❌ EmailJS method failed:', emailError);
            console.error('EmailJS error stack:', emailError.stack);
            
            // Only try direct EmailJS API call as backup if the main method truly failed
            if (!emailJSSuccess) {
                try {
                    console.log('🔄 Trying direct EmailJS API call...');
                    if (typeof sendSimpleEmail === 'function') {
                        await sendSimpleEmail(contactData);
                        emailJSSuccess = true;
                        console.log('✅ Direct EmailJS API call succeeded');
                    } else {
                        console.error('❌ sendSimpleEmail function not available');
                    }
                } catch (directEmailError) {
                    console.error('❌ Direct EmailJS API call also failed:', directEmailError);
                }
            } else {
                console.log('🚫 Skipping fallback method since main EmailJS already succeeded');
            }
        }
        
        // If either Firebase or EmailJS worked, show success
        if (firebaseSuccess || emailJSSuccess) {
            statusDiv.className = 'form-status success';
            let successMessage = `<strong>✅ Thank you ${contactData.name}!</strong><br>`;
            
            if (firebaseSuccess && emailJSSuccess) {
                successMessage += `Your message has been saved and we've been notified via email. `;
            } else if (firebaseSuccess) {
                successMessage += `Your message has been saved successfully. `;
                if (submissionId) {
                    successMessage += `<br><small>Submission ID: ${submissionId}</small><br>`;
                }
            } else if (emailJSSuccess) {
                successMessage += `We've received your message via email and `;
            }
            
            successMessage += `We'll respond within 3 business days.<br>`;
            successMessage += `<small>📧 You should also receive a confirmation email shortly.</small>`;
            
            statusDiv.innerHTML = successMessage;
            form.reset();
            
            // Redirect to thank you page
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 3000);
            return;
        }
        
        // If both Firebase and EmailJS failed, try PHP fallback
        if (form.action && form.action.includes('contact-process.php')) {
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    statusDiv.className = 'form-status success';
                    statusDiv.innerHTML = `
                        <strong>✅ Thank you ${contactData.name}!</strong><br>
                        ${result.message}<br>
                        <small>We'll respond to ${contactData.email} within 3 business days.</small>
                    `;
                    form.reset();
                    
                    setTimeout(() => {
                        window.location.href = 'thank-you.html';
                    }, 3000);
                    return;
                }
            } catch (phpError) {
                console.log('PHP method also failed:', phpError);
            }
        }
        
        // Final fallback - email client method
        throw new Error('All automated methods failed');
        
    } catch (error) {
        console.log('All server methods failed, using email client fallback:', error);
        
        // Final fallback to email client method
        const emailBody = `New consultation request from Health & Safety Research and Consultancy website

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.title}
Phone: ${contactData.phone}

Message:
${contactData.message}

---
This message was sent from the contact form on your website.
Timestamp: ${new Date().toLocaleString()}`;
        
        const subject = encodeURIComponent('New consultation request from Health & Safety Research and Consultancy website');
        const body = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:angzhixuan605@gmail.com?subject=${subject}&body=${body}`;
        
        statusDiv.className = 'form-status success';
        statusDiv.innerHTML = `
            <strong>✅ Thank you ${contactData.name}!</strong><br>
            Your message is ready to send. Click the button below to open your email client.<br>
            <button onclick="window.open('${mailtoLink}', '_blank'); showEmailSent();" class="btn" style="margin-top: 15px; font-size: 14px; padding: 10px 20px; background: #28a745; border: none; color: white; border-radius: 5px; cursor: pointer;">📧 Send Email Now</button>
            <p style="margin-top: 10px; font-size: 13px; color: #666;">
                Or contact us directly: <strong>andy.ang@sit.ac.nz</strong> | <strong>+64 021 172 5959</strong>
            </p>
        `;
        
        form.reset();
        
    } finally {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
}

// Function called when user clicks the email button
function showEmailSent() {
    const statusDiv = document.querySelector('#form-status');
    if (statusDiv) {
        setTimeout(() => {
            statusDiv.className = 'form-status success';
            statusDiv.innerHTML = `
                <strong>🎉 Email opened!</strong><br>
                Please send the message from your email client to complete your request.<br>
                <small>We'll respond within 24 hours.</small>
            `;
            
            // Redirect to thank you page after a moment
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 3000);
        }, 1000);
    }
}
