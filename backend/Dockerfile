# Use an official Python runtime as a parent image
FROM python:3.13.4-slim-bullseye

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
# This copies requirements.txt first to leverage Docker's caching
# (if requirements.txt doesn't change, these steps won't rerun)
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose port 8000 for the Uvicorn server
EXPOSE 8000

# Define environment variables (optional, good for configuration)
# ENV NAME YourAppName

# Command to run the application using Uvicorn
# --host 0.0.0.0 makes the app accessible from outside the container
# --port 8000 specifies the port Uvicorn listens on
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
