import { fetchLeaderboardData } from "./participantData.js";

const fetchData = async () => {
  try {
    const data = await fetchLeaderboardData();
    if (data) {
      console.log(data);
    } else {
      setError('Failed to fetch leaderboard data');
    }
  } catch (error) {
    setError('Error fetching leaderboard data');
  }
};

fetchData();