#!/usr/bin/env python3
import json
import urllib.request
import urllib.error

token = 'rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0'

# Try to list all services
print("🔍 Listing all Render services...")

try:
    url = 'https://api.render.com/v1/services'
    req = urllib.request.Request(url=url, method='GET')
    req.add_header('Authorization', f'Bearer {token}')
    
    with urllib.request.urlopen(req) as r:
        services = json.loads(r.read().decode('utf-8'))
        print(f"✓ Found {len(services)} services:\n")
        for service in services:
            print(f"  Name: {service.get('name')}")
            print(f"  ID: {service.get('id')}")
            print(f"  Type: {service.get('type')}")
            print(f"  Status: {service.get('status')}")
            print()

except urllib.error.HTTPError as e:
    print(f"✗ HTTP Error {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"✗ Error: {str(e)}")
