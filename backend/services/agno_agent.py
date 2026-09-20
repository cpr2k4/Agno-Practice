import os

from agno.agent import Agent
from agno.models.groq import Groq
from dotenv import load_dotenv

from tools.email_tools import email_user

load_dotenv(override=True)

groq_api_key = os.getenv("GROQ_API_KEY", "")
model_id = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

agent = Agent(
    model=Groq(id=model_id, api_key=groq_api_key),
    markdown=True,
    tools=[email_user],
    description=(
        "You are an email agent. Given a topic, write a short clear email "
        "(subject + body) and send it to the configured receiver using the "
        "email_user tool. Do not ask follow-up questions. Always send the email."
    ),
)


def send_email_about_topic(topic: str) -> str:
    prompt = (
        f"Send an email about this topic: {topic.strip()}. "
        "Create a suitable subject and a short body, then call the email_user tool "
        "with only subject and body."
    )
    response = agent.run(prompt)
    return str(response.content)
