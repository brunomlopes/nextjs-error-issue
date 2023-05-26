import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRepositoryCommits } from '../../../utils/githubAPI';

type Commit = {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
};

const RepoCommits = () => {
  const router = useRouter();
  const { owner, repo } = router.query;
  
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    const fetchCommits = async () => {
      const commits = await getRepositoryCommits(owner as string, repo as string);
      setCommits(commits);
    };

    fetchCommits();
  }, [owner, repo]);

  return (
    <div>
      <h1>Commits for {owner}/{repo}</h1>
      <ul>
        {commits.map(commit => (
          <li key={commit.sha}>
            <p>Commit: {commit.sha}</p>
            <p>Author: {commit.commit.author.name}</p>
            <p>Message: {commit.commit.message}</p>
            <a href={commit.html_url} target="_blank">See on GitHub</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoCommits;
