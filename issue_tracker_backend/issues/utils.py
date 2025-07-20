from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os

def enhance_description(raw_description: str) -> str:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

    prompt = PromptTemplate.from_template("Improve the following issue description:\n{desc}")
    chain = LLMChain(llm=llm, prompt=prompt)
    return chain.run({"desc": raw_description})
