#!/usr/bin/env python3
"""
End-to-end API test script for Mental Wellness API

Tests:
- Health, Docs
- Admin login, list users to find a mentor
- Student login, select mentor
- Student submit MCQ and Plain tests
"""
import os
import time
import json
import requests

BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:3000')


def pp(title, data):
    print(f"\n=== {title} ===")
    try:
        print(json.dumps(data, indent=2))
    except Exception:
        print(data)


def get(url, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.get(f"{BASE_URL}{url}", headers=headers)


def post(url, payload=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.post(f"{BASE_URL}{url}", headers=headers, json=payload or {})


def login(email, password):
    r = post('/api/auth/login', {"email": email, "password": password})
    return r


def main():
    print("🧪 Full API Test Suite")
    print("=" * 50)

    # 1) Health
    print("\n[1] Health check")
    r = get('/api/health')
    print(r.status_code, r.text[:120])
    assert r.status_code == 200

    # 2) Docs
    print("\n[2] Docs")
    r = get('/api/docs')
    print(r.status_code, r.text[:120])
    assert r.status_code == 200

    # 3) Admin login
    print("\n[3] Admin login")
    r = login('admin@test.com', 'admin123')
    print(r.status_code)
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    admin_token = r.json()['token']

    # 4) Get users to find a mentor
    print("\n[4] Get users (admin)")
    r = get('/api/auth/users', token=admin_token)
    print(r.status_code)
    assert r.status_code == 200, f"List users failed: {r.text}"
    users = r.json().get('users', [])
    mentor = next((u for u in users if u.get('role') == 'mentor'), None)
    assert mentor, "No mentor user found; ensure seeding created mentor@test.com"
    mentor_id = mentor['id']
    mentor_name = mentor['name']
    print(f"Found mentor: {mentor_name} ({mentor_id})")

    # 5) Student login
    print("\n[5] Student login")
    r = login('student@test.com', 'password123')
    print(r.status_code)
    assert r.status_code == 200, f"Student login failed: {r.text}"
    student_token = r.json()['token']

    # 6) Student selects mentor
    print("\n[6] Student select mentor")
    r = post('/api/students/select-mentor', {"mentor_id": mentor_id}, token=student_token)
    print(r.status_code, r.text[:160])
    assert r.status_code == 200, f"Select mentor failed: {r.text}"

    # 7) Submit MCQ test
    print("\n[7] Submit MCQ test")
    started = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(time.time() - 90))
    completed = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    payload = {
        "test_type": "mcq",
        "questions": [
            {"id": 1, "q": "How do you feel today?", "options": ["Good", "Okay", "Bad"]},
            {"id": 2, "q": "Did you sleep well?", "options": ["Yes", "No"]}
        ],
        "answers": {"1": "Good", "2": "Yes"},
        "started_at": started,
        "completed_at": completed,
        "meta": {"category": "daily-check"},
        "marks": 2
    }
    r = post('/api/tests/submit', payload, token=student_token)
    print(r.status_code, r.text[:160])
    assert r.status_code == 201, f"Submit MCQ failed: {r.text}"

    # 8) Submit Plain test
    print("\n[8] Submit Plain test")
    started = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(time.time() - 45))
    completed = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    payload = {
        "test_type": "plain",
        "questions": [
            "Describe your current stressors",
            "What coping strategies helped this week?"
        ],
        "answers": [
            "Workload and deadlines",
            "Walking and journaling"
        ],
        "started_at": started,
        "completed_at": completed,
        "meta": {"category": "weekly-reflection"}
    }
    r = post('/api/tests/submit', payload, token=student_token)
    print(r.status_code, r.text[:160])
    assert r.status_code == 201, f"Submit Plain failed: {r.text}"

    print("\n✅ All checks completed")


if __name__ == '__main__':
    main()


