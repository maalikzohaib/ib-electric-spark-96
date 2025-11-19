import fetch from 'node-fetch';

async function testCreatePage() {
    try {
        const response = await fetch('http://localhost:3100/api/pages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test Page ' + Date.now(),
                type: 'main',
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testCreatePage();
