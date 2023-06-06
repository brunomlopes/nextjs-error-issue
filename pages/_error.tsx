import { NextPageContext } from "next";

interface ErrorProps {
  statusCode: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

interface ErrorCauseWithStatusCode {
  statusCode: number;
}

function isErrorCauseWithStatusCode(e: any): e is ErrorCauseWithStatusCode {
  return (e as ErrorCauseWithStatusCode).statusCode !== undefined;
}

Error.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode =
    err?.statusCode ??
    (isErrorCauseWithStatusCode(err?.cause)
      ? err?.cause?.statusCode
      : undefined) ??
    res?.statusCode ??
    404;
  if (res == undefined) return { statusCode };
  if (statusCode == 404) res.statusCode = statusCode;
  return { statusCode };
};

export default Error;
