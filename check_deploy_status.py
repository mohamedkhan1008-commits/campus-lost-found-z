#!/usr/bin/env python3
import json
import urllib.request
import urllib.error

token = 'rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0'
service_id = 'srv-d77pl1ruibrs73c4ke30'

print("🔍 Checking deployment status...")
print("=" * 60)

try:
    # Get recent deploys
    deploy_url = f'https://api.render.com/v1/services/{service_id}/deploys'
    req = urllib.request.Request(url=deploy_url, method='GET')
    req.add_header('Authorization', f'Bearer {token}')
    
    with urllib.request.urlopen(req) as response:
        deploys_data = json.loads(response.read().decode('utf-8'))
    
    print(f"Recent deployments:")
    
    if isinstance(deploys_data, list):
        for i, deploy in enumerate(deploys_data[:3]):
            deploy_obj = deploy.get('deploy', {})
            print(f"\n  Deploy #{i+1}:")
            print(f"    ID: {deploy_obj.get('id')}")
            print(f"    Status: {deploy_obj.get('status')}")
            print(f"    Created: {deploy_obj.get('createdAt')}")
            print(f"    Build Command: {deploy_obj.get('buildCommand')}")
    
    # Also try to trigger with POST to deploys endpoint (empty body)
    print(f"\n📡 Attempting to trigger new deploy...")
    
    post_req = urllib.request.Request(url=deploy_url, method='POST')
    post_req.add_header('Authorization', f'Bearer {token}')
    post_req.add_header('Content-Type', 'application/json')
    post_req.data = b''
    
    try:
        with urllib.request.urlopen(post_req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"✅ Deploy triggered!")
            print(f"   Response: {result}")
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        if '409' in str(e.code):
            print(f"ℹ️  Deploy already in progress (409 Conflict)")
        else:
            print(f"⚠️  Status {e.code}: {error_msg}")

except Exception as e:
    print(f"Error: {str(e)}")

print("\n" + "=" * 60)
print("🌐 CHECK LIVE:")
print("https://campus-lost-found-z.onrender.com")
