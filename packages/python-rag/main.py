import os
from langchain_community.document_loaders import TextLoader
from langchain_mistralai.embeddings import MistralAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_mistralai.chat_models import ChatMistralAI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from dotenv import load_dotenv
import time
import httpx
from tenacity import retry, wait_exponential, stop_after_attempt


def create_rag_system(
    folder_path: str,
    embedding_model: str = "mistral",
    llm_model: str = "mistral",
    api_key: str = None
):
    """Creates a RAG system from Markdown files in a folder."""

    # Load all Markdown files
    documents = []
    for file in os.listdir(folder_path):
        if file.endswith(".md"):
            loader = TextLoader(os.path.join(folder_path, file))
            documents.extend(loader.load())

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter()
    docs = text_splitter.split_documents(documents)

    # Choose embedding model
    if embedding_model == "mistral":
        embeddings = MistralAIEmbeddings(
            model="mistral-embed", mistral_api_key=api_key)
    elif embedding_model == "openai":
        embeddings = OpenAIEmbeddings(openai_api_key=api_key)
    else:
        raise ValueError("Unsupported embedding model")

    # Create vector store
    vector = FAISS.from_documents(docs, embeddings)
    retriever = vector.as_retriever()

    # Choose LLM
    if llm_model == "mistral":
        model = ChatMistralAI(mistral_api_key=api_key)
    elif llm_model == "openai":
        model = ChatOpenAI(openai_api_key=api_key)
    else:
        raise ValueError("Unsupported LLM model")

    # Define prompt template
    prompt = ChatPromptTemplate.from_template("""You are an assistant that transforms zod schemas into vuejs components in vue3 with script setups

    <context>
    {context}
    </context>

    Transform the following zod schema:
    ```ts
    {input}
    ```""")

    # Create retrieval chain
    document_chain = create_stuff_documents_chain(model, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    return retrieval_chain


# Example usage
# Get the current script directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the relative path to the resources folder
folder = os.path.join(script_dir, "resources")

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("NUXT_MISTRAL_API_KEY")

# Ensure the key is loaded
if not api_key:
    raise ValueError(
        "NUXT_MISTRAL_API_KEY is missing. Set it in the .env file.")


@retry(wait=wait_exponential(multiplier=1, min=4, max=10), stop=stop_after_attempt(5))
def invoke_with_retry(rag_system, input_data):
    response = rag_system.invoke(input_data)
    return response


rag_system = create_rag_system(
    folder, embedding_model="mistral", llm_model="mistral", api_key=api_key)
response = invoke_with_retry(rag_system, {"input": '''
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "You must be at least 18"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

'''})
print(response["answer"])
