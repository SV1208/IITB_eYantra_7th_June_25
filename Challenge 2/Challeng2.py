import requests
import re
from typing import List, Optional

def fetch_scroll(url: str) -> Optional[str]:
    """Fetch the scroll content from the given URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print("Failed to retrieve the scroll:", e)
        return None

def extract_secrets(text: str) -> List[str]:
    """Extract secrets surrounded by {* and *} from the text."""
    return re.findall(r"\{\*(.*?)\*\}", text, re.DOTALL)

def display_secrets(secrets: List[str]) -> None:
    """Display the extracted secrets in a structured manner."""
    print("✨ Eldorian Secrets Revealed ✨")
    if not secrets:
        print("No secrets found in the scroll.")
    else:
        for idx, secret in enumerate(secrets, 1):
            print(f"{idx}. {secret.strip()}")

def main() -> None:
    url = "https://raw.githubusercontent.com/microsoft/CopilotAdventures/main/Data/scrolls.txt"
    scroll_content = fetch_scroll(url)
    if not scroll_content:
        return
    secrets = extract_secrets(scroll_content)
    display_secrets(secrets)

if __name__ == "__main__":
    main()