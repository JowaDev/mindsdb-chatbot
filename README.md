# MindsDB Chatbot Proof of Concept

## Project Overview

This project is a Proof of Concept (POC) aimed at creating a chatbot capable of providing knowledge in any format,
including URLs, PDF files, TXT files, etc. In this instance, we focus on utilizing PDFs as the primary source of
knowledge.

## Technology Stack

### MindsDB

[MindsDB](https://mindsdb.com/) is an open-source framework that allows you to easily create and deploy machine learning
models and AI-powered applications. It simplifies the process of building intelligent systems by providing a
user-friendly interface and seamless integration with various data sources. By leveraging MindsDB, we can efficiently
build our chatbot using its powerful machine learning capabilities.

### Next.js

[Next.js](https://nextjs.org/) is a popular React framework that enables developers to build server-rendered and
statically generated web applications. It is known for its performance and optimization features, making it a perfect
choice for our project, as it allows for rapid development and deployment of the frontend components of our chatbot.

## Requirements

1. **Bun Runtime**: Install Bun by following the instructions on the official website: [Bun.sh](https://bun.sh/).
2. **Docker Desktop**: We will use Docker to run the MindsDB backend in a container. Ensure you have Docker Desktop
   installed.

## Setup

1. Create an OpenAI API key by visiting this link: [OpenAI API Keys](https://platform.openai.com/api-keys).
2. Add your OpenAI API key in the `frontend/.env.local` file.
3. Install dependencies in the root directory as well as in the `frontend` folder by executing the following commands:

   ```bash
   bun i
   cd frontend && bun i
   cd ..
   ```

## Environment

To run the project, you can use the following commands:

- **Development**:
  ```bash
  bun run development
  ```

- **Production**:
  ```bash
  bun run production
  ```

## Clean Backend

If you need to reset the backend (i.e., clear files, models, agents, knowledge bases, etc.), you can use the following
command:

```bash
bun run clean-backend
```

## Contributing

We welcome contributions and suggestions for improvements! Please feel free to open issues or submit pull requests to
enhance the functionality of this chatbot POC.

## License

This project is licensed under the [MIT License](LICENSE).