// EmailJS configuration for free email notifications
// This works alongside Firebase - dual system for reliability

class EmailJSHandler {
    constructor() {
        this.serviceId = 'service_f8yi04k'; // Updated to match working credentials
        this.templateId = 'template_tf7wxqp'; // Updated to match working credentials  
        this.publicKey = 'COQd6djLvGcYQSyNw'; // This was already correct
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return true;
        
        try {
            // Check if EmailJS library is available
            if (typeof emailjs === 'undefined') {
                console.error('❌ EmailJS library not loaded');
                return false;
            }
            
            // Initialize EmailJS
            console.log('🔧 Initializing EmailJS with public key:', this.publicKey);
            emailjs.init(this.publicKey);
            this.initialized = true;
            console.log('✅ EmailJS initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ EmailJS initialization failed:', error);
            return false;
        }
    }

    async sendNotification(contactData) {
        console.log('📧 EmailJS sendNotification called with:', contactData);
        
        if (!await this.initialize()) {
            throw new Error('EmailJS not available');
        }

        const templateParams = {
            to_email: 'angzhixuan605@gmail.com',
            from_name: contactData.name,
            from_email: contactData.email,
            title: contactData.title || 'General Inquiry',
            phone: contactData.phone || 'Not provided',
            message: contactData.message,
            submission_date: new Date().toLocaleString(),
            reply_to: contactData.email
        };

        console.log('📋 EmailJS template params:', templateParams);
        console.log('🔧 Using service:', this.serviceId, 'template:', this.templateId);

        try {
            const response = await emailjs.send(this.serviceId, this.templateId, templateParams);
            console.log('✅ EmailJS success response:', response);
            return { success: true, response };
        } catch (error) {
            console.error('❌ EmailJS send error:', error);
            console.error('Error details:', {
                serviceId: this.serviceId,
                templateId: this.templateId,
                publicKey: this.publicKey,
                error: error
            });
            throw error;
        }
    }
}

// Export the handler
window.emailJSHandler = new EmailJSHandler();
