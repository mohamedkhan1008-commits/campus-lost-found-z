#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import sys

# Get service ID first
token = 'rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0'
owner_id = 'tea-d77pacggjchc73d35i00'
service_name = 'campus-lost-found-backend'

print(f"🔍 Finding service: {service_name}")

# List services to find the one we need
try:
    url = f'https://api.render.com/v1/owner/{owner_id}/services'
    req = urllib.request.Request(url=url, method='GET')
    req.add_header('Authorization', f'Bearer {token}')
    
    with urllib.request.urlopen(req) as r:
        services = json.loads(r.read().decode('utf-8'))
        print(f"✓ Found {len(services)} services")
        
        service_id = None
        for service in services:
            if service.get('name') == service_name:
                service_id = service.get('id')
                print(f"✓ Found service ID: {service_id}")
                break
        
        if not service_id:
            print(f"✗ Service '{service_name}' not found")
            print("Available services:")
            for service in services:
                print(f"  - {service.get('name')} ({service.get('id')})")
            sys.exit(1)
    
    # Now trigger a redeploy
    print(f"\n🚀 Triggering redeploy for {service_name}...")
    
    deploy_url = f'https://api.render.com/v1/services/{service_id}/deploys'
    deploy_body = {'clearCache': True}
    
    deploy_req = urllib.request.Request(
        url=deploy_url,
        data=json.dumps(deploy_body).encode('utf-8'),
        method='POST'
    )
    deploy_req.add_header('Authorization', f'Bearer {token}')
    deploy_req.add_header('Content-Type', 'application/json')
    
    with urllib.request.urlopen(deploy_req) as r:
        response = json.loads(r.read().decode('utf-8'))
        print(f"✓ Deploy triggered!")
        print(f"  Status: {response.get('status', 'pending')}")
        print(f"  ID: {response.get('id')}")
        print(f"\n📍 Watch progress at: https://dashboard.render.com/web/{service_id}")
        print(f"🌐 Service URL: https://campus-lost-found-z.onrender.com")

except urllib.error.HTTPError as e:
    print(f"✗ HTTP Error {e.code}")
    error_msg = e.read().decode('utf-8')
    print(error_msg)
    sys.exit(1)
except Exception as e:
    print(f"✗ Error: {str(e)}")
    sys.exit(1)
