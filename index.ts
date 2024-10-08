import dotenv from "dotenv";
dotenv.config();

import * as searchConsole from "@googleapis/searchconsole";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
    }
  }
}

const auth = new searchConsole.auth.GoogleAuth({
  credentials: {
    private_key: process.env.PRIVATE_KEY.replaceAll("\\n", "\n"),
    client_email: process.env.CLIENT_EMAIL,
  },
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});

const client = searchConsole.searchconsole({
  version: "v1",
  auth,
});

const fetchData = async () => {
  try {
    const response = await client.searchanalytics.query({
      siteUrl: process.env.WEBSITE,
      requestBody: {
        startDate: "2021-01-01",
        endDate: "2024-01-31",
        dimensions: ["page", "query", "device", "country"],
      },
    });
    console.log(JSON.stringify(response.data, null, 6));
  } catch (error) {
    console.log(error);
  }
};

fetchData();
