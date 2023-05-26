import axios from 'axios';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
});

export const getRepositoryCommits = async (owner: string, repo: string) => {
  const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`);
  return response.data;
};
