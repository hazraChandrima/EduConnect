import asyncio
from src.llm.qa_llm import QaLlm
from src.llm.qcm_chain import QCMGenerateChain


async def llm_call(qa_chain: QCMGenerateChain, text: list):
    print(f"llm call running...")
    batch_examples = await asyncio.gather(qa_chain.aapply_and_parse(text))
    print(f"llm call done.")

    return batch_examples



async def generate_quizz(content: str, num_questions: int = 5):
    # Generates a quiz from the given content.
    print("Debug: Calling QaLlm()...")  
    qa_llm = QaLlm()  

    llm_instance = qa_llm.get_llm()  
    print(f"Debug: LLM Instance: {llm_instance}")  

    if llm_instance is None:
        raise ValueError("LLM instance is None. Check API key or initialization!")

    qa_chain = QCMGenerateChain.from_llm(llm_instance, num_questions=num_questions)
    print(f"Debug: QA Chain Created: {qa_chain}")  

    return await llm_call(qa_chain, [{"doc": content, "num_questions": num_questions}])