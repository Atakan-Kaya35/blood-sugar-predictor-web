from flask import Flask, jsonify
from flask_cors import CORS  # ✅ import CORS

app = Flask(__name__)
CORS(app)  # ✅ allow all origins (or configure it below)

@app.route('/run/<string:username>/<string:password>', methods=['GET', 'POST'])
def run(username, password):
    response = {
        "safeness": True,
        "trend": 35,
        "befores": 120123126,
        "befores1": 118117116,
        "befores2": 110112114,
        "afters": 130131132,
        "indicators": 210,
        "user": username,
        "note": "This is a mock response for testing"
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(port=8080, debug=True, host="0.0.0.0")
