// EmailJS configuration for free email notifications
// This works alongside Firebase - dual system for reliability

class EmailJSHandler {
    constructor() {
        this.serviceId = 'service_g9if4cc'; // Your EmailJS service ID
        this.templateId = 'template_01yzw6j'; // Contact us template (notification to you at a.andy@hsresconsult.com)
        this.autoReplyTemplateId = 'template_kqny4fl'; // Auto-reply template (to customer)
        this.publicKey = 'nxA2M99h4wC63NlD-'; // Your EmailJS public key
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

        // Template params for notification to you (a.andy@hsresconsult.com)
        // IMPORTANT: Make sure your EmailJS template 'template_01yzw6j' has these settings:
        // - To Email: {{to_email}} variable (so we can control it from code)
        // - CC: {{cc_email}} variable (so we can control who gets CC'd)
        // - Reply To: {{reply_to}} variable
        const notificationParams = {
            to_email: 'a.andy@hsresconsult.com',  // Dr. Andy Ang
            cc_email: 'f.lamm@hsresconsult.com',  // Dr. Felicity Lamm - CC on notifications
            from_name: contactData.name || 'Unknown',
            from_email: contactData.email,
            reply_to: contactData.email,  // Important: allows you to reply directly to customer
            title: contactData.title || 'General Inquiry',
            phone: contactData.phone || 'Not provided',
            message: contactData.message || 'No message provided',
            submission_date: new Date().toLocaleString()
        };

        // Template params for auto-reply to customer
        // ⚠️ CRITICAL: In your EmailJS dashboard for template 'template_kqny4fl':
        // - To Email field: {{to_email}} (customer email only!)
        // - CC field: {{cc_email}} (we'll pass empty string to disable CC)
        // - BCC field: leave empty or use {{bcc_email}} 
        // - Reply To field: a.andy@hsresconsult.com (hardcoded in template)
        // 
        // By passing cc_email as empty string, we prevent the template from CC'ing anyone
        const autoReplyParams = {
            to_email: contactData.email.trim(),        // Customer's email - THIS IS WHERE AUTO-REPLY GOES
            cc_email: '',                               // EXPLICITLY NO CC - prevents auto-reply from CC'ing you
            bcc_email: '',                              // EXPLICITLY NO BCC
            customer_email: contactData.email.trim(),  // Alternative parameter name (backup)
            customer_name: contactData.name || 'Customer', // Customer's name for personalization
            inquiry_subject: contactData.title || 'General Inquiry',  // What they asked about
            submission_date: new Date().toLocaleString()
        };

        console.log('📋 EmailJS notification params:', notificationParams);
        console.log('📋 EmailJS auto-reply params:', autoReplyParams);
        console.log('📧 Notification will be sent to: a.andy@hsresconsult.com');
        console.log('📧 Notification will CC: f.lamm@hsresconsult.com');
        console.log('📧 Auto-reply will be sent ONLY to customer:', contactData.email);
        console.log('⚠️ Auto-reply CC is explicitly disabled (empty string)');
        console.log('🔍 Auto-reply to_email:', autoReplyParams.to_email);
        console.log('🔍 Auto-reply cc_email:', autoReplyParams.cc_email, '(should be empty)');

        try {
            // Send notification email to you (a.andy@hsresconsult.com)
            console.log('� Sending notification email...');
            const notificationResponse = await emailjs.send(this.serviceId, this.templateId, notificationParams);
            console.log('✅ EmailJS notification success:', notificationResponse);

            // Send auto-reply to customer
            let autoReplyResponse = null;
            if (this.autoReplyTemplateId && this.autoReplyTemplateId !== 'YOUR_AUTO_REPLY_TEMPLATE_ID') {
                console.log('� Sending auto-reply email to customer...');
                console.log('� Auto-reply recipient:', contactData.email);
                console.log('� Template ID:', this.autoReplyTemplateId);
                console.log('🔧 Parameters:', autoReplyParams);
                
                autoReplyResponse = await emailjs.send(this.serviceId, this.autoReplyTemplateId, autoReplyParams);
                console.log('✅ EmailJS auto-reply sent successfully:', autoReplyResponse);
            } else {
                console.warn('⚠️ Auto-reply template not configured');
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
