from app import app

# Vercel uses the WSGI `app` callable exported from this file.
# This file simply exposes the application created in the project's `app.py`.

if __name__ == "__main__":
    # Permite ejecutar localmente con `python api/index.py`
    app.run(debug=True)
