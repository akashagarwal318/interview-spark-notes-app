// Simple test to verify frontend-backend communication
fetch('http://localhost:5000/api/questions?limit=1')
  .then(response => response.json())
  .then(data => {
    console.log('API Test Success:', data);
    console.log('Questions received:', data.data.questions.length);
  })
  .catch(error => {
    console.error('API Test Failed:', error);
  });
