from fastapi import FastAPI

from api.routes import router

# ============================================
# APP
# ============================================

app = FastAPI(
    title="Mount Hua AI",
    version="1.0.0"
)

# ============================================
# ROUTES
# ============================================

app.include_router(router)

# ============================================
# ROOT
# ============================================

@app.get("/")
def root():

    return {
        "message": "Mount Hua AI Backend Running"
    }