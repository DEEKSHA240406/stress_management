"""
Response Model for storing test submissions
"""
from datetime import datetime
from bson import ObjectId
from config.db import db


class Response:
    """Represents a student's test submission (MCQ or Plain text)."""

    @staticmethod
    def get_collection():
        return db.get_collection('responses')

    @staticmethod
    def create_submission(student_id, test_type, questions, answers, started_at=None, completed_at=None, mentor_id=None, mentor_name=None, meta=None, marks=None):
        try:
            def parse_iso(ts):
                if not ts:
                    return None
                if isinstance(ts, datetime):
                    return ts
                if isinstance(ts, str):
                    # Support 'Z' suffix
                    iso = ts.replace('Z', '+00:00') if ts.endswith('Z') else ts
                    try:
                        return datetime.fromisoformat(iso)
                    except Exception:
                        return None
                return None

            started = parse_iso(started_at) or datetime.utcnow()
            completed = parse_iso(completed_at) or datetime.utcnow()

            duration_seconds = max(0, int((completed - started).total_seconds()))

            doc = {
                'student_id': ObjectId(student_id) if isinstance(student_id, str) else student_id,
                'mentor_id': ObjectId(mentor_id) if isinstance(mentor_id, str) else mentor_id,
                'mentor_name': mentor_name,
                'test_type': test_type,  # 'mcq' | 'plain'
                'questions': questions,  # array of question objects or strings
                'answers': answers,      # array/object; stored as-is
                'started_at': started,
                'completed_at': completed,
                'duration_seconds': duration_seconds,
                'meta': meta or {},
                'marks': marks,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }

            result = Response.get_collection().insert_one(doc)
            doc['_id'] = result.inserted_id
            return doc
        except Exception as e:
            raise e

    @staticmethod
    def list_by_student(student_id):
        sid = ObjectId(student_id) if isinstance(student_id, str) else student_id
        return list(Response.get_collection().find({'student_id': sid}))


