export const fetchLeaderboardData = async () => {
  try {
      const response = await fetch('http://127.0.0.1:8000/leaderboard', {
        method: 'GET'
      });
      if (response.ok) {
        const responseData = await response.json();
        // console.log(responseData);
        const transformedData = responseData.map(([name, data]) => data);

        console.log(transformedData)
      } 
      else {
        console.error('Failed to fetch leaderboard data:', response.status);
      }
  } 
  catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return null;
  }
};

// fetchLeaderboardData();
