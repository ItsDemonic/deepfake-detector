from db import Base, database_engine
import models

Base.metadata.create_all(bind=database_engine())