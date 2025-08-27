// Simple EmailJS fallback - direct API call
async function sendSimpleEmail(contactData) {
    // Validate required fields
    if (!contactData.email || !contactData.email.trim()) {
        console.error('❌ Customer email is missing or empty:', contactData.email);
        throw new Error('Customer email is required for auto-reply');
    }

    const notificationParams = {
        to_email: 'angzhixuan605@gmail.com',
        from_name: contactData.name || 'Unknown',
        from_email: contactData.email,
        phone: contactData.phone || 'Not provided',
        message: contactData.message || 'No message provided',
        submission_date: new Date().toLocaleString(),
        reply_to: contactData.email
    };

    const autoReplyParams = {
        to_email: contactData.email.trim(),        // Ensure no whitespace
        from_name: contactData.name || 'Customer',        // Matches {{from_name}} in template
        from_title: contactData.title || 'General Inquiry',  // Matches {{from_title}} in template
        from_email: contactData.email.trim(),      // Matches {{from_email}} in template
        submission_date: new Date().toLocaleString()
    };

    const notificationData = {
        service_id: 'service_f8yi04k',
        template_id: 'template_tf7wxqp',
        user_id: 'COQd6djLvGcYQSyNw',
        template_params: notificationParams
    };

    // Replace with your actual auto-reply template ID
    const AUTO_REPLY_TEMPLATE_ID = 'template_g3hs73r';
    
    const autoReplyData = {
        service_id: 'service_f8yi04k',
        template_id: AUTO_REPLY_TEMPLATE_ID,
        user_id: 'COQd6djLvGcYQSyNw',
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

        // Send auto-reply email (TEMPORARILY DISABLED TO DEBUG)
        let autoReplySuccess = false;
        console.log('⚠️ DIRECT AUTO-REPLY DISABLED FOR DEBUGGING');
        console.log('⚠️ The problem is in your EmailJS Auto-Reply template configuration');
        
        // DISABLED: 
        // if (AUTO_REPLY_TEMPLATE_ID && AUTO_REPLY_TEMPLATE_ID !== 'YOUR_AUTO_REPLY_TEMPLATE_ID') {
        //     const autoReplyResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(autoReplyData)
        //     });
        //     if (autoReplyResponse.ok) {
        //         console.log('✅ Direct EmailJS auto-reply API call successful');
        //         autoReplySuccess = true;
        //     } else {
        //         const errorText = await autoReplyResponse.text();
        //         console.warn('⚠️ Direct EmailJS auto-reply API call failed (notification still sent):', autoReplyResponse.status, errorText);
        //     }
        // }

        return { success: true, autoReplySent: autoReplySuccess };
    } catch (error) {
        console.error('❌ Direct EmailJS API call error:', error);
        throw error;
    }
}
