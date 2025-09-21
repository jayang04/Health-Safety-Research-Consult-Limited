// Simple EmailJS fallback - direct API call
async function sendSimpleEmail(contactData) {
    console.log('🔄 FALLBACK: Direct EmailJS API called - this should only happen if main EmailJS failed');
    console.log('🔄 If you see this AND the main EmailJS succeeded, that would cause duplicates');

    // Validate required fields
    if (!contactData.email || !contactData.email.trim()) {
        console.error('❌ Customer email is missing or empty:', contactData.email);
        throw new Error('Customer email is required for auto-reply');
    }

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

    const autoReplyParams = {
        to_email: contactData.email.trim(),        // Ensure no whitespace
        customer_email: contactData.email.trim(),  // Explicit customer_email parameter for template
        from_name: contactData.name || 'Customer',        // Matches {{from_name}} in template
        from_title: contactData.title || 'General Inquiry',  // Matches {{from_title}} in template
        from_email: contactData.email.trim(),      // Matches {{from_email}} in template
        submission_date: new Date().toLocaleString()
    };

    const notificationData = {
        service_id: 'service_g9if4cc',
        template_id: 'template_01yzw6j',
        user_id: 'GH8bkNQ2QMGej22aB',
        template_params: notificationParams
    };

    // Use the same auto-reply template ID as the main handler
    const AUTO_REPLY_TEMPLATE_ID = 'template_kqny4fl';
    
    const autoReplyData = {
        service_id: 'service_g9if4cc',
        template_id: AUTO_REPLY_TEMPLATE_ID,
        user_id: 'GH8bkNQ2QMGej22aB',
        template_params: autoReplyParams
    };

    console.log('🚀 Sending direct EmailJS API calls...');
    
    try {
        // Send notification email
        const notificationResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData)
        });

        if (!notificationResponse.ok) {
            const errorText = await notificationResponse.text();
            console.error('❌ Direct EmailJS notification API call failed:', notificationResponse.status, errorText);
            throw new Error(`Notification API call failed: ${notificationResponse.status}`);
        }

        console.log('✅ Direct EmailJS notification API call successful');

        // Send auto-reply email 
        let autoReplySuccess = false;
        
        if (AUTO_REPLY_TEMPLATE_ID && AUTO_REPLY_TEMPLATE_ID !== 'YOUR_AUTO_REPLY_TEMPLATE_ID') {
            try {
                console.log('📧 Sending direct auto-reply...');
                const autoReplyResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(autoReplyData)
                });
                
                if (autoReplyResponse.ok) {
                    console.log('✅ Direct EmailJS auto-reply API call successful');
                    autoReplySuccess = true;
                } else {
                    const errorText = await autoReplyResponse.text();
                    console.warn('⚠️ Direct EmailJS auto-reply API call failed (notification still sent):', autoReplyResponse.status, errorText);
                }
            } catch (autoReplyError) {
                console.warn('⚠️ Auto-reply failed but notification was sent:', autoReplyError);
            }
        } else {
            console.log('⚠️ Auto-reply template ID not configured');
        }

        return { success: true, autoReplySent: autoReplySuccess };
    } catch (error) {
        console.error('❌ Direct EmailJS API call error:', error);
        throw error;
    }
}
