document.getElementById("health-form").addEventListener("submit", function(event) {
    event.preventDefault();

    console.log("✅ Form Submitted, Showing Loading Spinner...");

    document.getElementById("advice-container").style.display = "block";
    document.getElementById("loading-spinner").style.display = "block";
    document.getElementById("advice-list").innerHTML = ""; // ล้างข้อมูลเก่า

    let height = parseFloat(document.getElementById("height").value);
    let weight = parseFloat(document.getElementById("weight").value);
    let bmi = isNaN(height) || isNaN(weight) ? "N/A" : (weight / ((height / 100) ** 2)).toFixed(2);

    const userData = {
        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value.trim(),
        gender: document.getElementById("gender").value.trim(),
        height: height.toString(),
        weight: weight.toString(),
        bmi: bmi,
        medical_history: document.getElementById("medical_history").value.trim().split(","),
        allergies: document.getElementById("allergies").value.trim().split(","),
        medications: document.getElementById("medications").value.trim().split(","),
        exercise_level: document.getElementById("exercise_level").value.trim(),
        sleep_hours: document.getElementById("sleep_hours").value.trim(),
        stress_level: document.getElementById("stress_level").value.trim(),
        smoking: document.getElementById("smoking").value.trim(),
        alcohol: document.getElementById("alcohol").value.trim(),
        health_goals: document.getElementById("health_goals").value.trim().split(","),
    };

    fetch("/get-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_data: userData }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ API Response Received, Hiding Spinner...");

        // ✅ ซ่อน Loading Spinner ทันทีที่ API ตอบกลับ
        document.getElementById("loading-spinner").style.display = "none";

        const adviceList = document.getElementById("advice-list");
        adviceList.innerHTML = ""; // ล้างข้อมูลก่อนแสดงผลใหม่

        const filteredAdvice = data.advice
            .split("\n")
            .map(advice => advice.trim()) // ตัดช่องว่าง
            .filter(advice => advice !== ""); // กรองบรรทัดว่าง

        filteredAdvice.forEach(advice => {
            let li = document.createElement("li");
            li.textContent = advice;
            adviceList.appendChild(li);
        });

        console.log("✅ Advice Displayed Successfully");
    })
    .catch(error => {
        console.error("❌ Error:", error);
        document.getElementById("loading-spinner").style.display = "none"; // ซ่อน Spinner ถ้ามี Error
        document.getElementById("advice-list").innerHTML = "<li>เกิดข้อผิดพลาด! กรุณาลองใหม่</li>";
    });
});
