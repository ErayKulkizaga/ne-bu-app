"""
Ingredient list parser.

Splits a raw ingredient string into individual tokens, handling:
- comma and semicolon delimiters
- nested parentheses (e.g. "E471 (emulsifier)")
- trailing whitespace and empty entries
"""
import re


def parse_ingredients(raw: str) -> list[str]:
    """
    Parse a raw ingredient string into a list of cleaned token strings.

    The parser preserves parenthetical qualifiers attached to each ingredient
    (e.g. "E471 (emulsifier)") rather than splitting on commas inside parens.
    """
    if not raw or not raw.strip():
        return []

    tokens: list[str] = []
    current: list[str] = []
    depth = 0

    for char in raw:
        if char == "(":
            depth += 1
            current.append(char)
        elif char == ")":
            depth = max(depth - 1, 0)
            current.append(char)
        elif char in (",", ";") and depth == 0:
            token = "".join(current).strip()
            if token:
                tokens.append(token)
            current = []
        else:
            current.append(char)

    last = "".join(current).strip()
    if last:
        tokens.append(last)

    return _clean_tokens(tokens)


def _clean_tokens(tokens: list[str]) -> list[str]:
    cleaned: list[str] = []
    for token in tokens:
        # Strip trailing punctuation and extra whitespace
        token = re.sub(r"[.\s]+$", "", token).strip()
        if token:
            cleaned.append(token)
    return cleaned


def extract_e_number(token: str) -> str | None:
    """
    Extract an E-number from a token string.
    Matches patterns like E100, E471, E621, E211a, etc.
    """
    match = re.search(r"\b(E\d{3,4}[a-z]?)\b", token, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return None
