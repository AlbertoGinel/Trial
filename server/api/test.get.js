//server/api/test.get.js
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    if (!session) {
      event.res.writeHead(401, { "Content-Type": "application/json" });
      event.res.end(JSON.stringify({ status: "unauthenticated" }));
      return;
    }

    const response = await fetch("https://api.fxer.net/api/trial", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-cache",
    });

    console.log("response: ", response);

    if (!response.ok) {
      console.error("Response not OK:", response);
      event.res.writeHead(500, { "Content-Type": "application/json" });
      event.res.end(
        JSON.stringify({
          error: `Request failed with status ${response.status}`,
        })
      );
      return;
    }

    const data = await response.json();
    event.res.writeHead(response.status, {
      "Content-Type": "application/json",
    });
    event.res.end(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching data:", error);
    event.res.writeHead(500, { "Content-Type": "application/json" });
    event.res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});
