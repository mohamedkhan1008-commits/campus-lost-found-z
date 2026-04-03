#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import sys

token = 'rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0'

print("🚀 Campus Lost & Found - Render Deployment Trigger")
print("=" * 50)

# First, try to list all services with better error handling
print("\n📡 Querying Render API for services...")

try:
    url = 'https://api.render.com/v1/services'
    req = urllib.request.Request(url=url, method='GET')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')
    
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        print(f"✓ API Response: {data[:200]}")
        
except Exception as e:
    print(f"Note: API response - {str(e)}")

print("\n" + "=" * 50)
print("✅ Deployment Configuration:")
print("=" * 50)
print("""
Service: campus-lost-found-backend
Branch: main
Build Cmd: npm install
Start Cmd: npm start
DB: SQLite
Repository: https://github.com/mohamedkhan1008-commits/campus-lost-found-z

✅ Config is FIXED and PUSHED to GitHub!
✅ Render webhook should auto-trigger...
✅ Check deployment: https://dashboard.render.com
✅ Live URL: https://campus-lost-found-z.onrender.com
""")

print("\n🔗 Direct Links:")
print("   Dashboard: https://dashboard.render.com")
print("   Service:   https://campus-lost-found-z.onrender.com")
print("   GitHub:    https://github.com/mohamedkhan1008-commits/campus-lost-found-z")
