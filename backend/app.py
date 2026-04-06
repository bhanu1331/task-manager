from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Create database
def get_db():
    conn = sqlite3.connect("tasks.db")
    conn.row_factory = sqlite3.Row
    return conn

# Create table
conn = get_db()
conn.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT)")
conn.close()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = get_db()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return jsonify([dict(row) for row in tasks])

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    conn = get_db()
    conn.execute("INSERT INTO tasks (title) VALUES (?)", (data['title'],))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"})

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    conn = get_db()
    conn.execute("DELETE FROM tasks WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.json
    conn = get_db()
    conn.execute("UPDATE tasks SET title=? WHERE id=?", (data['title'], id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=10000)