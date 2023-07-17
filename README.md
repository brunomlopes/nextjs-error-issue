# Custom errors with nextjs - wat.

Steps to repro:

Install deps and run as dev:
- `npm ci`
- `npm run dev`

Go to http://localhost:3000/commits/vercel/next.js
	Shows list of commits
Go to http://localhost:3000/commits/vercel/non-existing
	Shows an exception (ideally we'd show a 404 page)

Now, build a prod release:
- `npm run build`
- `npm run start`

Go to [http://localhost:3000/commits/vercel/next.js](http://localhost:3000/commits/vercel/next.js)
	Shows list of commits
	
Go to [http://localhost:3000/commits/vercel/non-existing](http://localhost:3000/commits/vercel/non-existing)
	Flashes "An error 404 occurred on server" which is replaced with "An error 500 occurred on server"
  We want it to show the 404 message. In our app, we'd show a custom 404 page for that case.
	
	
❓Two questions:
 - Why does the 404 get replaced with a 500?
Note: we cannot have a fully static 404 or 500 error page, and redirecting to a /404 or a /500 is not a desireable behaviour
	
 - How can I get the same behaviour for the error page in dev as in prod
Meaning, show our error page with a 404 or other error, instead of the stacktrace
