import emailjs from 'emailjs-com';

const genenrateOTP = () => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP.toString();
}

export const sendEmail = ( name, toEmail) => {
    const otp = genenrateOTP()
    emailjs.send("service_0rglfm3","template_k8gaaou",{
        name: name,
        otp: otp,
        to_email: toEmail,
    }, 
    "user_aquE64zAiPUlI5JsTtgVP");
    return otp
}