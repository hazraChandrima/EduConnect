import requests

url = "http://192.168.142.247:8000/text_to_quizz/"
data = {
    "content": """Artificial Intelligence (AI) is a branch of computer science that aims to create machines that can perform tasks that typically require human intelligence. These tasks include problem-solving, decision-making, learning, and understanding natural language. AI is broadly classified into two categories: narrow AI and general AI.

Narrow AI, also known as weak AI, is designed to perform specific tasks such as voice recognition, image processing, or playing chess. Examples include Apple's Siri, Google Assistant, and self-driving cars. On the other hand, general AI aims to perform any intellectual task that a human can do, but this type of AI is still in research.

Machine Learning (ML) is a subset of AI that focuses on building systems that can learn from and make decisions based on data. ML algorithms are categorized into supervised learning, unsupervised learning, and reinforcement learning. Supervised learning requires labeled data to train models, while unsupervised learning finds patterns in unlabeled data. Reinforcement learning involves training a model using rewards and punishments.

AI has various applications in different industries such as healthcare, finance, education, and entertainment. In healthcare, AI is used for diagnosing diseases, predicting patient outcomes, and assisting in surgeries. In finance, AI helps in fraud detection, stock market predictions, and customer service automation. AI-powered chatbots are transforming customer support in various sectors.

Despite its advantages, AI also poses ethical challenges such as bias in decision-making, job displacement, and concerns over privacy. Researchers and policymakers are working on regulations to ensure responsible AI development.""",
    "num_questions": 5
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
