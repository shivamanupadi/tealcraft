export default () => ({
  DATABASE_HOST: process.env.DATABASE_HOST ?? "",
  DATABASE_NAME: process.env.DATABASE_NAME ?? "",
  DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? "",
});
