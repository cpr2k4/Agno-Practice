import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv(override=True)


def email_user(subject: str, body: str) -> str:
    """Send an email to the configured receiver.

    Args:
        subject: The subject of the email.
        body: The body of the email.

    Returns:
        A success or error message.
    """
    receiver_email = os.getenv("RECEIVER_EMAIL")
    sender_name = os.getenv("SENDER_NAME")
    sender_email = os.getenv("SENDER_EMAIL")
    sender_passkey = os.getenv("SENDER_PASSKEY")

    if not receiver_email:
        return "error: No receiver email provided"
    if not sender_name:
        return "error: No sender name provided"
    if not sender_email:
        return "error: No sender email provided"
    if not sender_passkey:
        return "error: No sender passkey provided"

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{sender_name} <{sender_email}>"
    msg["To"] = receiver_email
    msg.set_content(body)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, sender_passkey)
            smtp.send_message(msg)
    except Exception as e:
        return f"error: {e}"

    return "email sent successfully"
