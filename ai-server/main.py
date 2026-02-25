from __future__ import annotations

import json
import os
import re
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None

load_dotenv()

app = FastAPI(title="AI Code Reviewer Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("BACKEND_ORIGIN", "http://localhost:5000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    code: str = Field(min_length=1)
    language: str = "text"


class AnalyzeResponse(BaseModel):
    bugs: str
    improvements: str
    time_complexity: str
    space_complexity: str
    better_code: str
    score: int
    code_smells: str
    security_warnings: str
    duplicate_code: str
    performance_suggestions: str
    naming_suggestions: str


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    code: str = ""
    language: str = "text"


class ChatResponse(BaseModel):
    answer: str


OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def estimate_complexity(code: str) -> tuple[str, str]:
    nested_loops = bool(re.search(r"for.+for|while.+while|for.+while|while.+for", code, flags=re.S))
    one_loop = bool(re.search(r"\b(for|while)\b", code))

    if nested_loops:
        return "O(n^2)", "O(1)"
    if one_loop:
        return "O(n)", "O(1)"
    return "O(1)", "O(1)"


def heuristic_analysis(code: str, language: str) -> AnalyzeResponse:
    lines = [line for line in code.splitlines() if line.strip()]
    todo_count = sum("TODO" in line or "FIXME" in line for line in lines)
    long_lines = sum(len(line) > 120 for line in lines)
    has_eval = bool(re.search(r"\beval\s*\(", code))
    has_print_debug = "console.log(" in code or "print(" in code

    time_c, space_c = estimate_complexity(code)

    score = 88
    score -= min(todo_count * 3, 12)
    score -= min(long_lines * 2, 12)
    if has_eval:
        score -= 20
    if has_print_debug:
        score -= 4
    score = max(45, min(98, score))

    return AnalyzeResponse(
        bugs="Potential issues: eval usage is unsafe." if has_eval else "No critical defects detected by static heuristic scan.",
        improvements=(
            f"Found {todo_count} TODO/FIXME markers and {long_lines} very long lines. "
            "Consider extracting methods and adding edge-case tests."
        ),
        time_complexity=time_c,
        space_complexity=space_c,
        better_code=(
            "Use smaller pure functions, explicit error handling, and guard clauses. "
            "Replace repeated blocks with reusable helpers."
        ),
        score=score,
        code_smells="Debug output and long methods reduce readability." if has_print_debug or long_lines else "No major code smells found.",
        security_warnings="Avoid eval and validate untrusted input." if has_eval else "No obvious security warning from heuristic scan.",
        duplicate_code="Potential duplication should be refactored into utility functions.",
        performance_suggestions="Prefer linear passes and avoid repeated work inside loops.",
        naming_suggestions="Use intention-revealing variable and function names aligned to domain behavior.",
    )


def _safe_json_parse(text: str) -> Optional[dict]:
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{.*\}", text, flags=re.S)
        if not match:
            return None
        try:
            return json.loads(match.group(0))
        except Exception:
            return None


def openai_analysis(code: str, language: str) -> Optional[AnalyzeResponse]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        return None

    client = OpenAI(api_key=api_key)

    prompt = f"""
You are a strict senior software engineer.
Analyze the following {language} code and return JSON only with keys:
bugs, improvements, time_complexity, space_complexity, better_code, score, code_smells, security_warnings, duplicate_code, performance_suggestions, naming_suggestions.
Score must be integer 0..100.

CODE:
{code[:12000]}
""".strip()

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "Return concise, production-grade code review feedback in strict JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    content = response.choices[0].message.content or ""
    parsed = _safe_json_parse(content)
    if not parsed:
        return None

    parsed["score"] = int(max(0, min(100, int(parsed.get("score", 75)))))
    for key in [
        "bugs",
        "improvements",
        "time_complexity",
        "space_complexity",
        "better_code",
        "code_smells",
        "security_warnings",
        "duplicate_code",
        "performance_suggestions",
        "naming_suggestions",
    ]:
        parsed[key] = str(parsed.get(key, "")).strip() or "N/A"

    return AnalyzeResponse(**parsed)


def openai_chat(question: str, code: str, language: str) -> Optional[str]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        return None

    client = OpenAI(api_key=api_key)
    code_block = code[:9000]

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a concise and practical code mentor. Give concrete improvements and examples.",
            },
            {
                "role": "user",
                "content": f"Language: {language}\nQuestion: {question}\nCode:\n{code_block}",
            },
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-server"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    model_result = openai_analysis(payload.code, payload.language)
    if model_result:
        return model_result
    return heuristic_analysis(payload.code, payload.language)


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    answer = openai_chat(payload.question, payload.code, payload.language)
    if answer:
        return ChatResponse(answer=answer)

    fallback = (
        "Improve this code by handling edge cases first, extracting repeated logic into helper functions, "
        "and adding tests for invalid and boundary inputs. Keep functions small and use descriptive naming."
    )
    return ChatResponse(answer=fallback)
