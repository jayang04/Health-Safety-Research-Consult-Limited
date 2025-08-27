// Simple EmailJS fallback - direct API call
async function sendSimpleEmail(contactData) {
    const templateParams = {
        to_email: 'angzhixuan605@gmail.com',
        from_name: contactData.name,
        from_email: contactData.email,
        phone: contactData.phone || 'Not provided',
        message: contactData.message,
        submission_date: new Date().toLocaleString(),
        reply_to: contactData.email
    };

    const data = {
        service_id: 'service_f8yi04k',
        template_id: 'template_tf7wxqp',
        user_id: 'COQd6djLvGcYQSyNw',
        template_params: templateParams
    };

    console.log('🚀 Sending direct EmailJS API call...');
    
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('✅ Direct EmailJS API call successful');
            return { success: true };
        } else {
            const errorText = await response.text();
            console.error('❌ Direct EmailJS API call failed:', response.status, errorText);
            throw new Error(`API call failed: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Direct EmailJS API call error:', error);
        throw error;
    }
}
