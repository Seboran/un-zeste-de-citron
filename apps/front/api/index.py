from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from invoke_rag import invoke_rag


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
        'answer': invoke_rag(schema)
    })


if __name__ == '__main__':
    app.run()
