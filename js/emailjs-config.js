// EmailJS configuration for free email notifications
// This works alongside Firebase - dual system for reliability

class EmailJSHandler {
    constructor() {
        this.serviceId = 'service_g9if4cc'; // Updated to match working credentials
        this.templateId = 'template_01yzw6j'; // Contact us template (notification to you)
        this.autoReplyTemplateId = 'template_kqny4fl'; // Auto-reply template (to customer)
        this.publicKey = 'GH8bkNQ2QMGej22aB'; // This was already correct
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

        // Validate required fields
        if (!contactData.email || !contactData.email.trim()) {
            console.error('❌ Customer email is missing or empty:', contactData.email);
            throw new Error('Customer email is required for auto-reply');
        }

        // Template params for notification to you
        const notificationParams = {
            to_email: 'a.andy@hsresconsult.com',
            from_name: contactData.name || 'Unknown',
            from_email: contactData.email,
            title: contactData.title || 'General Inquiry',
            phone: contactData.phone || 'Not provided',
            message: contactData.message || 'No message provided',
            submission_date: new Date().toLocaleString(),
            reply_to: contactData.email
        };

        // Template params for auto-reply to customer
        const autoReplyParams = {
            to_email: contactData.email.trim(),        // Should ONLY go to customer
            customer_email: contactData.email.trim(),  // Explicit customer_email parameter for template
            from_name: contactData.name || 'Customer', // Matches {{from_name}} in template
            from_title: contactData.title || 'General Inquiry',  // Matches {{from_title}} in template
            from_email: contactData.email.trim(),      // Matches {{from_email}} in template
            submission_date: new Date().toLocaleString()
        };

        console.log('📋 EmailJS notification params:', notificationParams);
        console.log('📋 EmailJS auto-reply params:', autoReplyParams);
        console.log('🚨 DEBUGGING: Customer email from form:', contactData.email);
        console.log('🚨 DEBUGGING: Auto-reply to_email parameter:', autoReplyParams.to_email);
        console.log('🔧 Auto-reply will be sent to CUSTOMER email:', contactData.email);
        console.log('🔧 Notification will be sent to YOUR email:', 'a.andy@hsresconsult.com');
        console.log('🔧 Are you testing with your own email as customer?', contactData.email === 'a.andy@hsresconsult.com');
        console.log('🔧 Using service:', this.serviceId, 'templates:', this.templateId, '&', this.autoReplyTemplateId);

        try {
            // Send notification email to you
            const notificationResponse = await emailjs.send(this.serviceId, this.templateId, notificationParams);
            console.log('✅ EmailJS notification success:', notificationResponse);

            // Send auto-reply to customer (RE-ENABLED WITH FIX)
            let autoReplyResponse = null;
            if (this.autoReplyTemplateId && this.autoReplyTemplateId !== 'YOUR_AUTO_REPLY_TEMPLATE_ID') {
                console.log('🚨 SENDING AUTO-REPLY WITH DEBUGGING:');
                console.log('🚨 Service ID:', this.serviceId);
                console.log('🚨 Template ID:', this.autoReplyTemplateId, '(should be template_jo2uzja)');
                console.log('🚨 Customer email (should receive auto-reply):', contactData.email);
                console.log('🚨 Parameters being sent:', JSON.stringify(autoReplyParams, null, 2));
                
                // Make sure we're sending to customer email only
                const fixedAutoReplyParams = {
                    customer_email: contactData.email.trim(),  // This goes to "To Email" field in your template
                    from_name: contactData.name || 'Customer',
                    from_title: contactData.title || 'General Inquiry',
                    from_email: contactData.email.trim(),
                    submission_date: new Date().toLocaleString()
                };
                
                console.log('🔧 FINAL AUTO-REPLY Parameters:', JSON.stringify(fixedAutoReplyParams, null, 2));
                console.log('🔧 The customer_email parameter will be used by EmailJS to determine recipient');
                
                autoReplyResponse = await emailjs.send(this.serviceId, this.autoReplyTemplateId, fixedAutoReplyParams);
                console.log('✅ EmailJS auto-reply sent to:', contactData.email);
                console.log('✅ Auto-reply response:', autoReplyResponse);
            }

            return { 
                success: true, 
                notificationResponse, 
                autoReplyResponse,
                autoReplySent: !!autoReplyResponse,
                message: 'Both notification and auto-reply sent successfully'
            };
        } catch (error) {
            console.error('❌ EmailJS send error:', error);
            console.error('Error details:', {
                serviceId: this.serviceId,
                templateId: this.templateId,
                autoReplyTemplateId: this.autoReplyTemplateId,
                publicKey: this.publicKey,
                error: error
            });
            throw error;
        }
    }
}

// Export the handler
window.emailJSHandler = new EmailJSHandler();
