from flask import Flask, render_template, request, jsonify
import ollama

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-advice', methods=['POST'])
def get_advice():
    try:
        data = request.json
        print("📥 Received data:", data)  # Log ข้อมูลที่ได้รับจาก Frontend

        user_data = data.get('user_data', {})

        # ตรวจสอบว่า height และ weight มีค่าไหม
        try:
            height_m = float(user_data['height']) / 100  # แปลง cm เป็น m
            weight_kg = float(user_data['weight'])
            user_data['bmi'] = round(weight_kg / (height_m ** 2), 2)  # คำนวณ BMI
        except (ValueError, KeyError):
            user_data['bmi'] = "N/A"  # ถ้าคำนวณไม่ได้ให้ใช้ "N/A"

        print("✅ Processed user data:", user_data)  # Log หลังจากคำนวณ BMI

        # สร้าง Prompt
        prompt = f"""
        User Information:
        Name: {user_data.get('name', 'N/A')}
        Age: {user_data.get('age', 'N/A')}
        Gender: {user_data.get('gender', 'N/A')}
        Height: {user_data.get('height', 'N/A')} cm
        Weight: {user_data.get('weight', 'N/A')} kg
        BMI: {user_data.get('bmi', 'N/A')}
        Medical History: {", ".join(user_data.get('medical_history', []))}
        Allergies: {", ".join(user_data.get('allergies', []))}
        Medications: {", ".join(user_data.get('medications', []))}
        Exercise Level: {user_data.get('exercise_level', 'N/A')}
        Sleep Hours: {user_data.get('sleep_hours', 'N/A')}
        Stress Level: {user_data.get('stress_level', 'N/A')}
        Smoking: {user_data.get('smoking', 'N/A')}
        Alcohol Consumption: {user_data.get('alcohol', 'N/A')}
        Health Goals: {", ".join(user_data.get('health_goals', []))}

        Based on this information, please provide health recommendations.
        """

        # ส่งข้อความไปยัง Ollama
        response = ollama.chat(model='llama2', messages=[{"role": "user", "content": prompt}])
        print("🤖 AI Response:", response)  # Log คำตอบจาก AI

        return jsonify({"advice": response['message']['content']})
    except Exception as e:
        print("❌ Error:", str(e))  # Log ข้อผิดพลาด
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
