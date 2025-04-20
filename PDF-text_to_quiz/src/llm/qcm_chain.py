from __future__ import annotations

from typing import Any

from langchain.chains.llm import LLMChain
from langchain.llms.base import BaseLLM
from langchain.output_parsers.regex import RegexParser

from langchain.prompts import PromptTemplate



def generate_regex_and_output_keys(num_questions):
    # Regex pattern for a single question
    single_question_pattern = (
        r"Question\s?\d?:\s+\n?(.*?)\nCHOICE_A(.*?)\nCHOICE_B(.*?)\nCHOICE_C(.*?)\nCHOICE_D(.*?)(?:\n)+Answer:\s?(.*)"
    )
    
    full_pattern = ""
    output_keys = []
    
    for i in range(1, num_questions + 1):
        full_pattern += single_question_pattern + r"\n?\n?"
        output_keys.extend([
            f"question{i}", f"A_{i}", f"B_{i}", f"C_{i}", f"D_{i}", f"reponse{i}"
        ])
    
    return full_pattern, output_keys



# Prompt template
template = """You are a teacher preparing questions for a quiz. Given the following document, please generate {num_questions} multiple-choice questions (MCQs) with 4 options and a corresponding answer letter based on the document.

Example question:

Question: question here
CHOICE_A: choice here
CHOICE_B: choice here
CHOICE_C: choice here
CHOICE_D: choice here
Answer: A or B or C or D

These questions should be detailed and solely based on the information provided in the document.

<Begin Document>
{doc}
<End Document>"""

class QCMGenerateChain(LLMChain):
    """LLM Chain specifically for generating examples for QCM answering."""

    @classmethod
    def from_llm(cls, llm: BaseLLM, num_questions: int = 2, **kwargs: Any) -> QCMGenerateChain:
        """Load QA Generate Chain from LLM."""
        regex_pattern, output_keys = generate_regex_and_output_keys(num_questions)
        
        output_parser = RegexParser(
            regex=regex_pattern,
            output_keys=output_keys
        )

        PROMPT = PromptTemplate(
            input_variables=["doc", "num_questions"],
            template=template,
            output_parser=output_parser
        )

        return cls(llm=llm, prompt=PROMPT, **kwargs)