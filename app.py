from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

key = os.getenv('accesskey')
print(key) 

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/try', methods=["POST"])
def getApi():
    return jsonify({'api_key': key})

if __name__ == '__main__':
    app.run(debug=True)
