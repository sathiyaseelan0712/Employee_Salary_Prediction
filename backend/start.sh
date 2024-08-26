#!/bin/bash

# Set JAVA_HOME environment variable
export JAVA_HOME='C:\Program Files\Java\jdk-22'

# Start the application with gunicorn
gunicorn app:app --bind 0.0.0.0:8000