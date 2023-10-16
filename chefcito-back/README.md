# Prerequisites

* PosgreSQL
* Node.js
* Npm

# Getting started

### Database

Set the `DATABASE_URL` in the .env file with your local info.

Run the migration with the following command:

```bash
npx prisma migrate dev
```

### API

To install the node.js packages run the following command in the root directory of the API project:

```
npm install
```

* Run the server with `npm run dev`
* Build with `npm run build`
