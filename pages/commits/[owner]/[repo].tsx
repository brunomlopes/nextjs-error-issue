import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ICommit,
  RepositoryCommits,
  getRepositoryCommits,
} from "../../../utils/githubAPI";

interface RepoCommitsProps {
  commits: ICommit[];
}

const RepoCommits: NextPage<RepoCommitsProps> = ({ commits }) => {
  const router = useRouter();
  // const { owner, repo } = router.query;

  // const [commits, setCommits] = useState<Commit[]>([]);

  // useEffect(() => {}, [owner, repo]);
  const owner = "test";
  const repo = "testrepo";
  return (
    <div>
      <h1>
        Commits for {owner}/{repo}
      </h1>
      <ul>
        {commits.map((commit) => (
          <li key={commit.sha}>
            <p>Commit: {commit.sha}</p>
            <p>Author: {commit.commit.author.name}</p>
            <p>Message: {commit.commit.message}</p>
            <a href={commit.html_url} target="_blank">
              See on GitHub
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const withInnovationCastContext =
  <T, D = []>({
    fn,
    requests = () => [],
    pageOptions = {},
  }: {
    fn: ICContextCallbackFnType<T, D>;
    requests?: (
      context: GetServerSidePropsContext,
      siteConfig: SiteConfig
    ) => any[];
    pageOptions?: PageOptions;
  }) =>
  async (context: GetServerSidePropsContext) => {
    const dataPromise = Promise.all([
      ...requests(context, {}).map(async (request) =>
        request ? await request() : undefined
      ),
    ]);

    const data: unknown[] = await dataPromise;

    return fn({}, data as unknown as D);
  };

export const getServerSideProps: GetServerSideProps = withInnovationCastContext<
  {},
  [{ commits: ICommit[] }]
>({
  fn: async (d, data) => {
    const commits = data[0] || null;
    return { props: { commits } };
  },
  requests: (ctx, config) => {
    const { owner, repo } = ctx.query;

    const fetchCommits = async () => {
      const commits = await getRepositoryCommits(
        owner as string,
        repo as string
      );
      return commits;
    };

    return [fetchCommits];
  },
});
class SiteConfig {}

class PageOptions {}

interface ICGetServerSidePropsContext {}

type ICContextCallbackFnType<T, D> = {
  (content: ICGetServerSidePropsContext, loadedData: D): Promise<{
    props: T;
  }>;
};
export default RepoCommits;
