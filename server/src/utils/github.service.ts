export const fetchGithubProfile = async (username: string) => {
  try {
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-App"
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers })
    ]);

    if (!userResponse.ok) {
      throw new Error("Failed to fetch Github user");
    }

    const userData = await userResponse.json();
    const reposData = await reposResponse.json();

    return {
      followers: userData.followers,
      publicRepos: userData.public_repos,
      repos: reposData.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        forks: repo.forks_count
      }))
    };
  } catch (error) {
    console.error("Github Integration Error:", error);
    // Graceful fallback if API fails
    return {
      followers: 0,
      publicRepos: 0,
      repos: []
    };
  }
};
