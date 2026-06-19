import json
import os

def prepare_for_llama(input_path: str, output_path: str):
    """
    Convertit le dataset en format Llama3 instruction tuning.
    Format : <|begin_of_text|><|start_header_id|>user<|end_header_id|>
    """
    with open(input_path, "r") as f:
        data = json.load(f)

    formatted = []
    for item in data:
        text = (
            f"<|begin_of_text|>"
            f"<|start_header_id|>system<|end_header_id|>\n"
            f"You are WorldCup Copilot, an expert AI assistant for FIFA World Cup 2026.\n"
            f"<|eot_id|>"
            f"<|start_header_id|>user<|end_header_id|>\n"
            f"{item['instruction']}\n"
            f"<|eot_id|>"
            f"<|start_header_id|>assistant<|end_header_id|>\n"
            f"{item['response']}\n"
            f"<|eot_id|>"
        )
        formatted.append({"text": text})

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(formatted, f, indent=2)

    print(f"Dataset préparé : {len(formatted)} exemples")
    print(f"Sauvegardé dans : {output_path}")


if __name__ == "__main__":
    prepare_for_llama(
        input_path="../data/dataset.json",
        output_path="../data/processed/dataset_llama3.json",
    )