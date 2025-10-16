// Test the authentication fix
console.log('🧪 Testing Authentication Fix...\n');

const testAuth = async () => {
  try {
    console.log('1. Testing /api/login fallback route...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      redirect: 'manual'
    });
    
    console.log('Status:', loginResponse.status);
    console.log('Headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.status === 302) {
      const location = loginResponse.headers.get('location');
      console.log('✅ Login redirects to:', location);
      
      if (location === '/dev-admin-login') {
        console.log('✅ Development mode redirect working correctly');
      } else {
        console.log('⚠️ Unexpected redirect location');
      }
    }
    
    console.log('\n2. Testing guest login endpoint...');
    const guestResponse = await fetch('http://localhost:5000/api/guest-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log('Guest login status:', guestResponse.status);
    if (guestResponse.ok) {
      const data = await guestResponse.json();
      console.log('✅ Guest login response:', data);
    } else {
      console.log('❌ Guest login failed');
    }
    
    console.log('\n3. Testing /api/auth/user after guest login...');
    const userResponse = await fetch('http://localhost:5000/api/auth/user', {
      credentials: 'include'
    });
    
    console.log('User status:', userResponse.status);
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ User data:', userData);
    } else {
      console.log('❌ User fetch failed - expected in development without session');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testAuth();