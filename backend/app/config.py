from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    api_host: str = "127.0.0.1"
    api_port: int = 5000
    cors_allowed_origins: str = "http://localhost:3000,http://localhost:5173"
    database_url: str = ""
    ml_model_path: str = "../ml/models/chilli_disease_best.pth"
    
    class Config:
        env_file = ".env"

settings = Settings()
