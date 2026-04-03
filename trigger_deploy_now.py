#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import sys
import time

token = 'rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0'

print("🚀 DEPLOYING Campus Lost & Found Backend")
print("=" * 60)

try:
    # Get services to find the ID
    print("\n📍 Step 1: Finding service ID...")
    url = 'https://api.render.com/v1/services'
    req = urllib.request.Request(url=url, method='GET')
    req.add_header('Authorization', f'Bearer {token}')
    
    with urllib.request.urlopen(req) as response:
        services_data = json.loads(response.read().decode('utf-8'))
        
    # Extract service info
    if isinstance(services_data, list) and len(services_data) > 0:
        service_info = services_data[0]
        service_obj = service_info.get('service', {})
        service_id = service_obj.get('id')
        service_name = service_obj.get('name')
        
        print(f"✓ Found service: {service_name}")
        print(f"✓ Service ID: {service_id}")
        print(f"✓ Auto-Deploy: {service_obj.get('autoDeploy')}")
        print(f"✓ Status: {service_obj.get('status')}")
        
        if service_id:
            # Trigger deployment
            print(f"\n📡 Step 2: Triggering deployment...")
            
            deploy_url = f'https://api.render.com/v1/services/{service_id}/deploys'
            deploy_req = urllib.request.Request(
                url=deploy_url,
                data=json.dumps({'clearCache': True}).encode('utf-8'),
                method='POST'
            )
            deploy_req.add_header('Authorization', f'Bearer {token}')
            deploy_req.add_header('Content-Type', 'application/json')
            
            try:
                with urllib.request.urlopen(deploy_req) as response:
                    deploy_response = json.loads(response.read().decode('utf-8'))
                    print(f"✅ DEPLOYMENT TRIGGERED!")
                    print(f"   Deploy ID: {deploy_response.get('id')}")
                    print(f"   Status: {deploy_response.get('status')}")
                    
            except urllib.error.HTTPError as e:
                if e.code == 409:
                    print(f"ℹ️  Deployment already in progress")
                else:
                    print(f"⚠️  HTTP {e.code}: {e.read().decode('utf-8')}")
            
        else:
            print("❌ Could not find service ID")
    
    print("\n" + "=" * 60)
    print("✅ DEPLOYMENT STATUS")
    print("=" * 60)
    print(f"""
📊 Watching build progress:
   🔗 https://dashboard.render.com
   
🌐 Test your app:
   🔗 https://campus-lost-found-z.onrender.com
   
📝 What to expect:
   1. Build starts (will compile dependencies)
   2. npm install completes
   3. Server starts on port 10000
   4. SQLite database initializes
   5. App goes live in ~2-5 minutes
""")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print(f"\n⚠️  Try manually at: https://dashboard.render.com")
