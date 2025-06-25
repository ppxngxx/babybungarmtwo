// ข้อมูลจังหวัด สถานที่ท่องเที่ยว และค่าเดินทางโดยประมาณ (จากกรุงเทพฯ)
const provinces = [
    {
        name: "ภูเก็ต",
        places: ["หาดป่าตอง", "แหลมพรหมเทพ", "เกาะพีพี"],
        cost: { plane: 1800, car: 2200, bus: 900, train: 0 },
        distance: 840,
        gmap: "https://www.google.com/maps/dir/กรุงเทพมหานคร/ภูเก็ต/"
    },
    {
        name: "สุราษฎร์ธานี",
        places: ["เกาะสมุย", "เขื่อนรัชชประภา", "อุทยานแห่งชาติเขาสก"],
        cost: { plane: 1500, car: 1800, bus: 700, train: 600 },
        distance: 650,
        gmap: "https://www.google.com/maps/dir/กรุงเทพมหานคร/สุราษฎร์ธานี/"
    },
    {
        name: "กระบี่",
        places: ["อ่าวนาง", "เกาะห้อง", "ทะเลแหวก"],
        cost: { plane: 1700, car: 2100, bus: 850, train: 0 },
        distance: 780,
        gmap: "https://www.google.com/maps/dir/กรุงเทพมหานคร/กระบี่/"
    },
    {
        name: "สงขลา",
        places: ["หาดสมิหลา", "เขาตังกวน", "เกาะยอ"],
        cost: { plane: 1600, car: 2000, bus: 800, train: 700 },
        distance: 950,
        gmap: "https://www.google.com/maps/dir/กรุงเทพมหานคร/สงขลา/"
    },
    {
        name: "ตรัง",
        places: ["เกาะกระดาน", "ถ้ำมรกต", "หาดปากเมง"],
        cost: { plane: 1600, car: 2000, bus: 800, train: 0 },
        distance: 830,
        gmap: "https://www.google.com/maps/dir/กรุงเทพมหานคร/ตรัง/"
    },
    {
        name: "นครศรีธรรมราช",
        places: ["วัดพระมหาธาตุ", "หาดขนอม", "น้ำตกกรุงชิง"],
        cost: { plane: 1500, car: 1800, bus: 700, train: 600 },
        distance: 780,
        gmap: "https://www.google.com/maps/dir/กรุงเทพมหานคร/นครศรีธรรมราช/"
    }
];

const provinceSelect = document.getElementById('province');
const placesList = document.getElementById('places-list');
const resultDiv = document.getElementById('result');
const distanceSection = document.getElementById('distance-section');
const gmapLink = document.getElementById('gmap-link');

// เติม dropdown จังหวัด
provinces.forEach((prov, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = prov.name;
    provinceSelect.appendChild(opt);
});

// อัปเดตสถานที่ท่องเที่ยวเมื่อเลือกจังหวัด
function updatePlaces() {
    const idx = provinceSelect.value;
    placesList.innerHTML = '';
    provinces[idx].places.forEach(place => {
        const li = document.createElement('li');
        li.textContent = place;
        placesList.appendChild(li);
    });
    // แสดงระยะทาง
    distanceSection.innerHTML = `ระยะทางจากกรุงเทพฯ ≈ <b>${provinces[idx].distance.toLocaleString()} กม.</b>`;
    // อัปเดตลิงก์ Google Maps
    gmapLink.href = provinces[idx].gmap;
}
provinceSelect.addEventListener('change', updatePlaces);
provinceSelect.value = 0;
updatePlaces();

// คำนวณค่าเดินทาง
const calculateBtn = document.getElementById('calculate-btn');
calculateBtn.addEventListener('click', () => {
    const idx = provinceSelect.value;
    const transport = document.querySelector('input[name="transport"]:checked').value;
    const cost = provinces[idx].cost[transport];
    let msg = '';
    if (cost === 0) {
        msg = 'ไม่มีบริการเดินทางด้วยวิธีนี้ไปยังจังหวัดนี้';
    } else {
        msg = `ค่าเดินทางโดยประมาณจากกรุงเทพฯ ไป ${provinces[idx].name} ด้วย${transportTH(transport)}: <b>${cost.toLocaleString()} บาท</b>`;
    }
    resultDiv.innerHTML = msg;
});

function transportTH(key) {
    switch(key) {
        case 'plane': return 'เครื่องบิน';
        case 'car': return 'รถยนต์';
        case 'bus': return 'รถทัวร์';
        case 'train': return 'รถไฟ';
        default: return '';
    }
}

// === AI Chat Widget ===
const GEMINI_API_KEY = 'AIzaSyA35LCCnO0RQm4zhBJrZZPZSRIJoQvd610'; // ใส่ API Key ของคุณ
const aiChatBtn = document.getElementById('ai-chat-btn');
const aiChatBox = document.getElementById('ai-chatbox');
const aiChatClose = document.getElementById('ai-chat-close');
const aiChatForm = document.getElementById('ai-chat-form');
const aiChatInput = document.getElementById('ai-chat-input');
const aiChatMessages = document.getElementById('ai-chat-messages');

aiChatBtn.onclick = () => {
  aiChatBox.style.display = 'flex';
  setTimeout(() => aiChatInput.focus(), 100);
};
aiChatClose.onclick = () => aiChatBox.style.display = 'none';
aiChatForm.onsubmit = async (e) => {
  e.preventDefault();
  const question = aiChatInput.value.trim();
  if (!question) return;
  appendMessage('user', question);
  aiChatInput.value = '';
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  appendMessage('ai', 'กำลังค้นหาคำตอบ...');
  // เรียกใช้งาน Gemini API (Google Generative Language)
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    });
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'ขออภัย ไม่สามารถตอบได้ในขณะนี้';
    replaceLastAIMessage(answer);
  } catch {
    replaceLastAIMessage('ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ AI');
  }
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
};
function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = role;
  div.textContent = text;
  aiChatMessages.appendChild(div);
}
function replaceLastAIMessage(text) {
  const msgs = aiChatMessages.querySelectorAll('.ai');
  if (msgs.length) msgs[msgs.length-1].textContent = text;
}
// === END AI Chat Widget ===
