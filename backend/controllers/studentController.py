"""
Student-related actions: mentor selection and test submission
"""
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from models.User import User
from models.Response import Response


class StudentController:
    @staticmethod
    def select_mentor():
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json() or {}
            mentor_id = data.get('mentor_id')
            if not mentor_id:
                return jsonify({'success': False, 'message': 'mentor_id is required'}), 400

            ok, err = User.set_student_mentor(current_user_id, mentor_id)
            if not ok:
                return jsonify({'success': False, 'message': err or 'Unable to set mentor'}), 400

            student = User.find_by_id(current_user_id)
            return jsonify({
                'success': True,
                'message': 'Mentor selected successfully',
                'student': {
                    'id': str(student['_id']),
                    'name': student['name'],
                    'email': student['email'],
                    'role': student['role'],
                    'mentor_id': str(student.get('mentor_id')) if student.get('mentor_id') else None,
                    'mentor_name': student.get('mentor_name')
                }
            }), 200
        except Exception as e:
            return jsonify({'success': False, 'message': 'Server error setting mentor'}), 500

    @staticmethod
    def submit_test():
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json() or {}
            test_type = data.get('test_type') 
            questions = data.get('questions')
            answers = data.get('answers')
            started_at = data.get('started_at')
            completed_at = data.get('completed_at')
            meta = data.get('meta')
            marks = data.get('marks')

            if test_type not in ['mcq', 'plain']:
                return jsonify({'success': False, 'message': 'test_type must be mcq or plain'}), 400
            if questions is None or answers is None:
                return jsonify({'success': False, 'message': 'questions and answers are required'}), 400

            student = User.find_by_id(current_user_id)
            mentor_id = student.get('mentor_id') if student else None
            mentor_name = student.get('mentor_name') if student else None

            doc = Response.create_submission(
                student_id=current_user_id,
                test_type=test_type,
                questions=questions,
                answers=answers,
                started_at=started_at,
                completed_at=completed_at,
                mentor_id=mentor_id,
                mentor_name=mentor_name,
                meta=meta,
                marks=marks
            )

            return jsonify({
                'success': True,
                'message': 'Test submitted successfully',
                'submission_id': str(doc['_id']),
                'duration_seconds': doc['duration_seconds']
            }), 201
        except Exception as e:
            return jsonify({'success': False, 'message': 'Server error submitting test'}), 500


