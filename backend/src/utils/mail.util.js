const nodemailer = require('nodemailer');

exports.sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Frontend URL'ini doğru şekilde oluştur
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"My Accounts" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Şifre Sıfırlama',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Inter', system-ui, -apple-system, sans-serif;
                            line-height: 1.5;
                            background-color: #09090B;
                            color: #E5E7EB;
                            padding: 2rem;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #18181B;
                            border-radius: 0.75rem;
                            padding: 2rem;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 2rem;
                        }
                        .title {
                            font-size: 1.5rem;
                            font-weight: 700;
                            color: #E5E7EB;
                            margin-bottom: 1rem;
                        }
                        .description {
                            color: #9CA3AF;
                            margin-bottom: 2rem;
                        }
                        a.button {
                            display: inline-block;
                            background-color: #4F46E5;
                            color: #ffffff;
                            padding: 0.75rem 1.5rem;
                            text-decoration: none;
                            border-radius: 0.5rem;
                            font-weight: 600;
                        }
                        a.button:hover {
                            background-color: #4338CA;
                        }
                        .footer {
                            margin-top: 2rem;
                            text-align: center;
                            color: #9CA3AF;
                            font-size: 0.875rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="title">Şifrenizi Sıfırlayın</h1>
                            <p class="description">
                                Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu link 10 dakika süreyle geçerli olacaktır.
                            </p>
                        </div>
                        <div style="text-align: center;">
                            <a href="${resetURL}" class="button">Şifremi Sıfırla</a>
                        </div>
                        <div class="footer">
                            <p>Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.</p>
                            <p>My Accounts uygulamasını kullandığınız için teşekkür ederiz.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
};