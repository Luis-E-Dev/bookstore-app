import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

SENDER = "Bookstore <onboarding@resend.dev>"

def send_new_book_notification(title: str, author: str, read_more_url: str, emails: list[str]):
    app_url = os.getenv("FRONTEND_URL", "https://bookstore-app-hazel.vercel.app")
    for email in emails:
        try:
            resend.Emails.send({
                "from": SENDER,
                "to": email,
                "subject": f"New book added: {title}",
                "html": f"""
                    <h2>A new book has been added to the Bookstore!</h2>
                    <p><strong>{title}</strong> by {author}</p>
                    <p>
                        <a href="{app_url}" style="
                            display: inline-block;
                            padding: 10px 20px;
                            background: #1a73e8;
                            color: white;
                            text-decoration: none;
                            border-radius: 4px;
                        ">Visit the Bookstore</a>
                    </p>
                    <hr />
                    <p style="font-size: 0.85rem; color: #888;">
                        You're receiving this because you opted in to book notifications.
                    </p>
                """,
            })
        except Exception as e:
            print(f"Failed to send email to {email}: {e}")
