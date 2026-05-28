from kokoro import KPipeline

# ============================================
# GLOBAL PIPELINE
# ============================================

pipeline = None

# ============================================
# INIT PIPELINE
# ============================================

def initialize_pipeline():

    global pipeline

    if pipeline is None:

        print(
            "\nInitializing Kokoro..."
        )

        pipeline = KPipeline(
            lang_code='a'
        )

        print(
            "Kokoro Ready."
        )

# ============================================
# GET PIPELINE
# ============================================

def get_pipeline():

    global pipeline

    if pipeline is None:

        initialize_pipeline()

    return pipeline