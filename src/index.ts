import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// zod helps to validate input at runtime, when code executes
import { z } from "zod";
// import { placeOrder } from "./trade";
import { Octokit } from "octokit";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Add an addition tool
// allowing LLM to add two numbers
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  })
);

server.tool(
  "github-gist",
  {
    title: "write-gist on github",
    description: "Write a gist on github",
    inputSchema: {
      description: z.string().min(1, "Description cannot be empty"),
      content: z.string().min(1, "Content cannot be empty"),
      isPublic: z.boolean(),
    },
  },
  async ({ description, content, isPublic }) => {
    let res;
    try {
      res = await octokit.request("POST /gists", {
        description: description,
        public: isPublic,
        files: {
          "README.md": {
            content: content || "No content provided",
          },
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    } catch (error) {
      console.error("Error creating gist:", error);
      return {
        content: [
          {
            type: "text",
            text: `Gist created unsuccessfully: ${error}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Gist created successfully: ${res.data.html_url}`,
        },
      ],
    };
  }
);

// Add a dynamic greeting resource
// server.registerResource(
//   "greeting",
//   new ResourceTemplate("greeting://{name}", { list: undefined }),
//   {
//     title: "Greeting Resource",
//     description: "Dynamic greeting generator",
//   },
//   async (uri, { name }) => ({
//     contents: [
//       {
//         uri: uri.href,
//         text: `Hello, ${name}!`,
//       },
//     ],
//   })
// );

// Start receiving messages on stdin and sending messages on stdout
const init = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

init().catch((error) => {
  console.error("Error initializing MCP server:", error);
});
