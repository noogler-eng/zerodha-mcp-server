### MCP server
- why mcp server ?, we are using them as claude does't know the zerodha api's to tell about trend in stocks. this make the access the claude to the zerodha platform. it giving some context LLM (claude, openai, chagpt).
- claude has support for MCP server (anthropic discover this). MCP server makes the connection between LLM and backend. https://github.com/modelcontextprotocol/servers, server already there.

### MCP 
- modal context protocol
- LLM -> format -> MCP server -> backend / application 
- current MCP server
    - https://github.com/modelcontextprotocol/servers
- claude with [youtube, amazon, zerodha, k8s, aws .....]
- integration of different platforms with MCP
- most of them are written in ts, mostly use ts-sdk ....

### Artitecture
- connection between zerodha backend using API, trade programatically
- log in with zerodha (for new user creating new account on top zerodha)
- hit callback url (zerodha hit a redirect url)
- getting data from zerodha (free account)

### zerodha typescript/sdk -
