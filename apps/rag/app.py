from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from invoke_rag import (get_form_from_input,
                        get_tests_from_input_data_and_form)

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/generate', methods=['POST'])
@cross_origin()
def generate():
    data = request.get_json()
    schema = data.get('schema')
    if schema is None or not isinstance(schema, str):
        return jsonify({'error': 'Invalid input'}), 400
    return jsonify({
        'answer': get_form_from_input(schema)
    })


@app.route('/api/test', methods=['POST'])
@cross_origin()
def generate_test():
    data = request.get_json()
    form = data.get('form')
    if form is None or not isinstance(form, str):
        return jsonify({'error': 'Invalid input'}), 400
    return jsonify({
        'answer': get_tests_from_input_data_and_form(form)
    })


if __name__ == '__main__':
    app.run()
