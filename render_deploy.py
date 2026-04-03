import json, urllib.request, urllib.error

url = 'https://api.render.com/v1/services'
body = {
    'type': 'web_service',
    'name': 'campus-lost-found-backend',
    'ownerId': 'tea-d77pacggjchc73d35i00',
    'repo': 'https://github.com/mohamedkhan1008-commits/campus-lost-found-z',
    'branch': 'main',
    'runtime': 'node',
    'serviceDetails': {
        'buildCommand': 'npm install',
        'startCommand': 'npm start',
        'healthCheckPath': '/api/health',
        'envVars': [
            {'key': 'NODE_ENV', 'value': 'production'},
            {'key': 'DB_TYPE', 'value': 'sqlite'},
            {'key': 'SQLITE_FILE', 'value': '/opt/render/project/data/campus_lost_found.sqlite'},
            {'key': 'PORT', 'value': '10000'},
            {'key': 'JWT_SECRET', 'value': 'PLEASE_CHANGE_THIS_TO_SECURE'}
        ]
    }
}

token = 'rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0'
req = urllib.request.Request(url=url, data=json.dumps(body).encode('utf-8'), method='POST')
req.add_header('Authorization', f'Bearer {token}')
req.add_header('Content-Type', 'application/json')

try:
    with urllib.request.urlopen(req) as r:
        print('status', r.status)
        print(r.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('status', e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('exception', str(e))
