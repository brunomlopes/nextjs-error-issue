import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ICommit,
  RepositoryCommits,
  getRepositoryCommits,
} from "../../../utils/githubAPI";
import { isArray } from "util";

interface RepoCommitsProps {
  repoCommits: RepositoryCommits;
}

const RepoCommits: NextPage<RepoCommitsProps> = ({ repoCommits }) => {
  const { commits, nextPage, prevPage, owner, repo } = repoCommits;
  const router = useRouter();
  // const { owner, repo } = router.query;

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
      <div>
        {prevPage && (
          <a href={`/commits/${owner}/${repo}?page=${prevPage}`}>&lt;</a>
        )}
        {nextPage && (
          <a href={`/commits/${owner}/${repo}?page=${nextPage}`}>&gt;</a>
        )}
      </div>
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
  [{ commits: RepositoryCommits }]
>({
  fn: async (d, data) => {
    const repoCommits = data[0] || null;
    return { props: { repoCommits } };
  },
  requests: (ctx, config) => {
    const { owner, repo, page } = ctx.query;

    var pageInt: number | undefined = undefined;
    if (Array.isArray(page)) pageInt = parseInt(page[0], 10);
    else if (page) pageInt = parseInt(page, 10);

    const fetchCommits = async () => {
      const commits = await getRepositoryCommits(
        owner as string,
        repo as string,
        pageInt
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
