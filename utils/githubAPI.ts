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
  owner: string;
  repo: string;
  commits: ICommit[];
  nextPage: number | null;
  prevPage: number | null;
};

export async function getRepositoryCommits(
  owner: string,
  repo: string,
  page?: number
): Promise<RepositoryCommits> {
  const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
    params: { page },
  });

  // Parse Link header
  const linkHeader = response.headers.link;
  const links = linkHeader ? parseLinkHeader(linkHeader) : {};

  return {
    owner: owner,
    repo: repo,
    commits: response.data,
    nextPage: links.next ? parseInt(links.next.page, 10) : null,
    prevPage: links.prev ? parseInt(links.prev.page, 10) : null,
  };
}

// Function to parse Link header
const parseLinkHeader = (header: string) => {
  const links: { [name: string]: { url: string; page: string } } = {};
  const parts = header.split(",");

  parts.forEach((part) => {
    const section = part.split(";");
    const url = section[0].replace(/<(.*)>/, "$1").trim();
    const name = section[1].replace(/rel="(.*)"/, "$1").trim();
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get("page");
    if (!page) return;

    links[name] = {
      url,
      page,
    };
  });

  return links;
};
