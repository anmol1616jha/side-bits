"""
Checks the curated word lists against an English dictionary and word-frequency
data. A preparation aid only: nothing here ships with the app.

Setup (once, outside the repo):
    python3 -m venv /tmp/wordaudit && /tmp/wordaudit/bin/pip install wordfreq
    npm pack an-array-of-english-words && tar xzf an-array-of-english-words-*.tgz

Run from this package's folder:
    /tmp/wordaudit/bin/python -I scripts/audit-words.py path/to/package/index.json

Reports, per word: missing from the dictionary, and frequency (Zipf scale,
roughly log10 of uses per billion words) that looks out of line for its tier.
Frequency is a guide, not a rule: familiar but rarely written words such as
"giraffe" are easy despite a low score, so review flags rather than obey them.
"""

import json
import re
import sys
from pathlib import Path

from wordfreq import zipf_frequency

DATA = Path(__file__).resolve().parent.parent / "src" / "data"

# Expected Zipf ranges per tier; outside them is flagged for a second look.
RANGES = {"easy": (3.0, 9.0), "medium": (2.3, 4.9), "hard": (1.3, 4.0)}

TIER = re.compile(r'(easy|medium|hard):\s*\n?\s*"([^"]*)"')
THEME = re.compile(r'id: "([^"]+)",\s*label: "[^"]*",\s*words:((?:\s*"[^"]*"\s*\+?)+)')


def words_in(text):
    return [token.split(":")[0] for token in text.split()]


def main():
    dictionary = set(json.loads(Path(sys.argv[1]).read_text()))
    seen = {}
    problems = 0
    for path in sorted(DATA.glob("*.ts")):
        if path.name in ("types.ts", "themes.ts"):
            continue
        for tier, text in TIER.findall(path.read_text()):
            low, high = RANGES[tier]
            for word in words_in(text):
                if word in seen:
                    print(f"DUPLICATE  {word} ({seen[word]} and {tier})")
                    problems += 1
                seen[word] = tier
                if word not in dictionary:
                    print(f"NOT IN DICTIONARY  {word} [{tier}]")
                    problems += 1
                score = zipf_frequency(word, "en")
                if not low <= score <= high:
                    print(f"FREQUENCY  {word} [{tier}] zipf={score}")

    themes = DATA / "themes.ts"
    if themes.exists():
        for theme, text in THEME.findall(themes.read_text()):
            for word in words_in(" ".join(re.findall(r'"([^"]*)"', text))):
                if word not in seen:
                    print(f"THEME WORD MISSING  {word} in {theme}")
                    problems += 1

    counts = {tier: sum(1 for t in seen.values() if t == tier) for tier in RANGES}
    print(f"{len(seen)} words: {counts}. {problems} hard problems.")


main()
