FROM python:3.12

# Set working directory
WORKDIR /mount

# Copy requirements.txt to the container
COPY mount/python /mount/python

# Create and activate a virtual environment
RUN python -m venv venv
RUN /bin/bash -c "source venv/bin/activate"

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r python/requirements.txt

# Copy the rest of the application code
COPY . .

# Command to keep the container running
CMD ["/bin/bash", "-c", "tail -f /dev/null"]
