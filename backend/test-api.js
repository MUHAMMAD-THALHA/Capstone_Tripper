const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testAPI() {
    try {
        // First, check if the server is running
        console.log('Checking if server is running...');
        try {
            await axios.get(`${API_BASE_URL}`);
            console.log('Server is running!\n');
        } catch (error) {
            console.error('Server is not running. Please start the server with: node app.js\n');
            return;
        }

        // Check environment variables
        console.log('Testing OpenAI API Configuration...');
        try {
            const testResponse = await axios.get(`${API_BASE_URL}/ai/test`);
            console.log('API Test Response:', testResponse.data);
            
            if (testResponse.data.error) {
                console.error('\nAPI Configuration Error:', testResponse.data.error);
                console.log('Please check your .env file and ensure OPENAI_API_KEY is set correctly.\n');
                return;
            }
            
            console.log('\nAPI is configured correctly!\n');
        } catch (error) {
            console.error('Error testing API configuration:', error.response ? error.response.data : error.message);
            console.log('\nPlease check:');
            console.log('1. Your .env file exists in the backend directory');
            console.log('2. OPENAI_API_KEY is set in your .env file');
            console.log('3. The API key is valid and has sufficient credits\n');
            return;
        }

        // Test tour suggestions
        console.log('Testing Tour Suggestions...');
        try {
            const suggestionsResponse = await axios.post(`${API_BASE_URL}/ai/suggestions`, {
                query: 'Paris'
            });
            console.log('Suggestions Response:', suggestionsResponse.data);
            console.log('\nTour suggestions working correctly!\n');
        } catch (error) {
            console.error('Error testing tour suggestions:', error.response ? error.response.data : error.message);
        }

        // Test destination search
        console.log('Testing Destination Search...');
        try {
            const destinationsResponse = await axios.post(`${API_BASE_URL}/ai/destinations`, {
                input: 'Paris'
            });
            console.log('Destinations Response:', destinationsResponse.data);
            console.log('\nDestination search working correctly!\n');
        } catch (error) {
            console.error('Error testing destination search:', error.response ? error.response.data : error.message);
        }

        // Test personalized recommendations
        console.log('Testing Personalized Recommendations...');
        try {
            const recommendationsResponse = await axios.post(`${API_BASE_URL}/ai/recommendations`, {
                query: 'Paris',
                preferences: {
                    interests: ['museums', 'food'],
                    budget: 'medium',
                    duration: '3 days'
                }
            });
            console.log('Recommendations Response:', recommendationsResponse.data);
            console.log('\nPersonalized recommendations working correctly!\n');
        } catch (error) {
            console.error('Error testing recommendations:', error.response ? error.response.data : error.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

testAPI(); 