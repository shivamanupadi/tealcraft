FROM python:3.12

# Set working directory
WORKDIR /app

# Copy requirements.txt to the container
COPY app/requirements.txt .

# Create and activate a virtual environment
RUN python -m venv venv
RUN /bin/bash -c "source venv/bin/activate"

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Command to keep the container running
CMD ["/bin/bash", "-c", "tail -f /dev/null"]
