# ⚡ EV Charge Now

![EV](https://img.shields.io/badge/Project-EV%20Infrastructure-green)
![Hackathon](https://img.shields.io/badge/Built%20for-Hackathons-orange)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20CSS%20JS-blue)
![Maps](https://img.shields.io/badge/Maps-Leaflet%20%7C%20OpenStreetMap-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

EV Charge Now is a **smart emergency battery assistance platform for Electric Vehicles (EVs)**.

It helps EV drivers who run out of battery receive **portable battery delivery** through:

- 🚁 Drone delivery  
- 🚗 Nearby drivers (car pooling assistance)  
- 🛻 Service vehicles  

The system uses **GPS, maps, and real-time tracking** to connect stranded drivers with the nearest energy source.

---

# 🚗 Problem

One of the biggest concerns with EV adoption is **range anxiety**.

Drivers may run out of battery before reaching a charging station, leaving them stranded.

Current solutions are inefficient:

- Vehicle towing
- Long wait times
- Expensive roadside services
- Lack of emergency charging infrastructure

---

# 💡 Solution

EV Charge Now provides a **real-time emergency EV charging request platform**.

When a driver runs out of battery:

1️⃣ The driver opens the platform  
2️⃣ The system detects their **GPS location**  
3️⃣ Nearby **energy stations or helpers** are identified  
4️⃣ The user chooses a **delivery method**  
5️⃣ A **portable battery pack is delivered**

The vehicle receives **enough charge to reach the nearest charging station**.

---

# 🚀 Features

## 📍 Smart Location Detection

- GPS location detection
- Interactive map interface
- Manual pin placement
- Accurate stranded vehicle location

---

## 🚁 Multiple Delivery Options

### Drone Delivery
Autonomous drones deliver portable batteries directly to the stranded EV.

### Car Pooling Assistance
Drivers within **10–17 km radius** receive request notifications.

Nearby drivers can:

1. Accept the request  
2. Pick up a battery from a nearby energy station  
3. Deliver it to the stranded EV  

Drivers are **paid through the platform**.

### Service Vehicle
A dedicated EV assistance vehicle delivers emergency battery packs.

---

## 🗺️ Live Tracking

Real-time delivery tracking with:

- Moving delivery vehicle marker
- Route visualization
- Estimated arrival time
- Map-based tracking system

---

## 📦 Order History

Users can view previous requests including:

- Delivery method
- Battery type
- Order cost
- Delivery status
- Date and time

Each order includes a **Reorder button** for fast requests.

---

# 🧠 System Workflow

```
Driver runs out of battery
        │
        ▼
Open EV Charge Now platform
        │
        ▼
GPS detects user location
        │
        ▼
Find nearest energy station
        │
        ▼
Select delivery method
 (Drone / Driver / Vehicle)
        │
        ▼
Battery picked up
        │
        ▼
Live tracking
        │
        ▼
Battery delivered
```

---

# 🏗 System Architecture

```
User (Web Browser)
        │
        ▼
Frontend
HTML + CSS + JavaScript
        │
        ▼
Map System
Leaflet.js + OpenStreetMap
        │
        ▼
Request Matching Logic
        │
        ▼
Helper / Drone / Service Vehicle
        │
        ▼
Battery Delivered
```

---

# 🛠 Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Maps
- Leaflet.js
- OpenStreetMap
- GPS Location API

### Backend (Planned)
- Python
- Flask / FastAPI

### Database (Planned)
- JSON storage
- MongoDB

---

# 📂 Project Structure

```
ev-charge-now
│
├── index.html
├── style.css
├── script.js
│
├── pages
│   ├── location.html
│   ├── delivery.html
│   ├── tracking.html
│   └── history.html
│
└── assets
    ├── images
    └── icons
```

---

# 📸 Screenshots

*(Add screenshots after uploading them to your repo)*

### Homepage

```
/assets/screenshots/home.png
```

### Location Selection

```
/assets/screenshots/location.png
```

### Delivery Tracking

```
/assets/screenshots/tracking.png
```

### Order History

```
/assets/screenshots/history.png
```

---

# 🌍 Real World Impact

This project supports:

- Smart mobility
- Sustainable transportation
- EV infrastructure
- Community-powered assistance

It helps reduce **EV downtime and range anxiety**.

---

# 🔮 Future Improvements

- 🤖 AI-based helper matching
- 🚁 Autonomous drone fleet
- 📱 Mobile app (Android & iOS)
- 💳 Integrated payments
- 🔋 Smart battery swap stations
- ⚡ Charging station locator
- 📊 Predictive battery alerts

---

# 🧪 Hackathon Relevance

This project demonstrates:

- Real-time logistics systems
- Smart city EV solutions
- Community-based infrastructure
- Sustainable energy support

Perfect for:

- Smart Mobility Hackathons
- EV Infrastructure Projects
- Smart City Innovation Challenges

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/sankuwasfound/ev-charge-now.git
```

Open the folder:

```bash
cd ev-charge-now
```

Run locally using **Live Server** in VS Code or open:

```
index.html
```

---

# 🚀 Deployment

This project can be easily deployed using **Vercel**.

Steps:

1. Push the project to GitHub
2. Go to Vercel
3. Import the repository
4. Click **Deploy**

Your website will be live instantly.

---

# 👨‍💻 Author

**Sankarshana V Shastry**

GitHub  
https://github.com/sankuwasfound

---

# ⭐ Contributing

Contributions are welcome!

Steps:

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Submit a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.
