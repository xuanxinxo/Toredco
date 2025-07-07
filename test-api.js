// Test script để kiểm tra API jobs
// Chạy: node test-api.js

async function testAPI() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Jobs APIs...\n');
  
  // Test 1: API việc làm mới nhất
  console.log('1️⃣ Testing /api/jobs/new...');
  try {
    const response1 = await fetch(`${baseURL}/api/jobs/new`);
    const data1 = await response1.json();
    console.log('✅ Status:', response1.status);
    console.log('📊 Response:', Array.isArray(data1) ? `${data1.length} jobs` : 'Invalid format');
    console.log('📝 Sample job:', data1[0] ? { id: data1[0].id, title: data1[0].title } : 'No jobs');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '─'.repeat(50) + '\n');
  
  // Test 2: API tất cả việc làm
  console.log('2️⃣ Testing /api/jobs...');
  try {
    const response2 = await fetch(`${baseURL}/api/jobs`);
    const data2 = await response2.json();
    console.log('✅ Status:', response2.status);
    console.log('📊 Response format:', data2.jobs ? 'Correct' : 'Invalid');
    console.log('📝 Jobs count:', data2.jobs ? data2.jobs.length : 'N/A');
    console.log('📄 Pagination:', data2.pagination ? data2.pagination : 'N/A');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '─'.repeat(50) + '\n');
  
  // Test 3: API tất cả việc làm với parameters
  console.log('3️⃣ Testing /api/jobs with parameters...');
  try {
    const response3 = await fetch(`${baseURL}/api/jobs?page=1&limit=5&search=developer`);
    const data3 = await response3.json();
    console.log('✅ Status:', response3.status);
    console.log('📊 Response format:', data3.jobs ? 'Correct' : 'Invalid');
    console.log('📝 Jobs count:', data3.jobs ? data3.jobs.length : 'N/A');
    console.log('📄 Pagination:', data3.pagination ? data3.pagination : 'N/A');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '─'.repeat(50) + '\n');
  console.log('🎉 Testing completed!');
}

// Chạy test nếu file được execute trực tiếp
if (typeof window === 'undefined') {
  testAPI().catch(console.error);
} 