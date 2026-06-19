from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"

    USE_FINETUNED_MODEL: bool = False
    FINETUNED_MODEL_PATH: str = "../fine_tuning/models/worldcup-llama3-lora"

    # Football API
    FOOTBALL_API_KEY: str = ""
    FOOTBALL_API_BASE_URL: str = "https://api.football-data.org/v4"

    HF_TOKEN: str = ""

    GROQ_API_KEY: str = ""
    LLM_PROVIDER: str = "groq"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()