import os
from SYSTEM_PROMPT import TEST_BUILDING_SYSTEM_PROMPT, VUEJS_BUILDING_SYSTEM_PROMPT
from dotenv import load_dotenv
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai.chat_models import ChatMistralAI
from langchain_mistralai.embeddings import MistralAIEmbeddings
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from tenacity import retry, stop_after_attempt, wait_exponential

MISTRAL_MODEL = "mistral-large-latest"


def create_rag_system(
    folder_path: str,
    system_prompt: str,
    embedding_model: str = "mistral",
    llm_model: str = "mistral",
    api_key: str = None
):
    """Creates a RAG system from Markdown files in a folder."""

    # Load all Markdown files
    documents = []
    for file in os.listdir(folder_path):
        if file.endswith(".vue"):
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
        model = ChatMistralAI(mistral_api_key=api_key,
                              model=MISTRAL_MODEL)
    elif llm_model == "openai":
        model = ChatOpenAI(openai_api_key=api_key)
    else:
        raise ValueError("Unsupported LLM model")

    # Define prompt template

    prompt = ChatPromptTemplate.from_template(system_prompt)

    # Create retrieval chain
    document_chain = create_stuff_documents_chain(model, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    return retrieval_chain


# Example usage
# Get the current script directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the relative path to the resources folder
folder = os.path.join(script_dir, "resources/form")

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("NUXT_MISTRAL_API_KEY")

# Ensure the key is loaded
if not api_key:
    raise ValueError(
        "NUXT_MISTRAL_API_KEY is missing. Set it in the .env file.")

vuejsFormBuilder = create_rag_system(
    folder, embedding_model="mistral", llm_model="mistral", api_key=api_key, system_prompt=VUEJS_BUILDING_SYSTEM_PROMPT)


@retry(wait=wait_exponential(multiplier=1, min=4, max=10), stop=stop_after_attempt(5))
def get_form_from_input(zod_schema: str):
    """Takes a string input and returns a response based on the rag_system"""
    return vuejsFormBuilder.invoke({"input": zod_schema})["answer"]


unitTestFormBuilder = create_rag_system(
    folder, embedding_model="mistral", llm_model="mistral", api_key=api_key, system_prompt=TEST_BUILDING_SYSTEM_PROMPT)


@retry(wait=wait_exponential(multiplier=1, min=4, max=10), stop=stop_after_attempt(5))
def get_tests_from_input_data_and_form(input_data: str):
    """Takes a string input and returns a response based on the rag_system"""
    return unitTestFormBuilder.invoke({"input": "```vuejs\n" + input_data + "\n```"})["answer"]


# response = invoke_rag('''
# import { z } from "zod";

# export const registerSchema = z.object({
#   name: z.string().min(1, "Name is required"),
#   email: z.string().email("Invalid email"),
#   age: z.number().min(18, "You must be at least 18"),
#   password: z.string().min(6, "Password must be at least 6 characters"),
# });

# ''', rag_system=rag_system)
# print(response)
