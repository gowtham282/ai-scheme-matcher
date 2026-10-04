import os
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def generate_otp() -> str:
    """Generate a secure 6-digit numeric OTP."""
    return f"{secrets.randbelow(900000) + 100000}"

def send_admin_verification_email(to_email: str, admin_name: str, otp_code: str) -> bool:
    """
    Send OTP verification email for Platform Admin registration.
    Logs prominently to console for demo/testing and attempts SMTP if configured.
    """
    print("\n" + "=" * 76)
    print("GOVERNMENT SCHEME MATCHING PLATFORM - OFFICIAL ADMIN EMAIL VERIFICATION")
    print(f"To Email   : {to_email}")
    print(f"Admin Name : {admin_name}")
    print(f"ONE-TIME PASSWORD (OTP) : [ {otp_code} ]")
    print("Validity   : 10 Minutes")
    print("Policy     : Single Official Administrator Registration")
    print("=" * 76 + "\n")

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM", smtp_user or "admin-portal@schemes.gov.in")

    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"Admin Registration Verification Code: {otp_code} - Government Scheme Portal"
            msg["From"] = f"Government Scheme Portal <{from_email}>"
            msg["To"] = to_email

            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #0b2545; color: #ffffff; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-size: 20px;">Government Scheme Recommendation Platform</h2>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #93c5fd;">Single Administrator Authorization Service</p>
                </div>
                <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
                    <p>Dear <strong>{admin_name}</strong>,</p>
                    <p>You have initiated registration as the <strong>Official Administrator / Nodal Officer</strong> for the AI-Powered Government Scheme Matching Platform.</p>
                    <p>Please use the following 6-digit One-Time Password (OTP) to verify your official email address and activate your administrator credentials:</p>
                    <div style="background-color: #f1f5f9; border: 2px dashed #0b2545; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0b2545;">{otp_code}</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b;">
                        * This OTP is strictly confidential and valid for <strong>10 minutes</strong>.<br>
                        * <strong>Security Policy:</strong> Only ONE administrator account is permitted for this platform.
                    </p>
                </div>
                <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                    Official Government Digital Service Portal - Smart India Hackathon Initiative
                </div>
            </div>
            """
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(from_email, [to_email], msg.as_string())
            print(f"[OK] Email successfully dispatched to {to_email} via {smtp_host}")
            return True
        except Exception as e:
            print(f"[WARN] SMTP delivery failed ({e}), console verification remains active.")
            return False
    return True
