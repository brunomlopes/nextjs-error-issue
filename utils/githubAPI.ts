import axios from "axios";

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
});

export interface ICommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

export type RepositoryCommits = {
  commits: ICommit[];
};

export async function getRepositoryCommits(
  owner: string,
  repo: string
): Promise<RepositoryCommits> {
  const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`);
  return response.data;
}
