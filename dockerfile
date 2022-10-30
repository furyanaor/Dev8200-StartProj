#syntax=docker/dockerfile:1
FROM python:3.8-alpine
WORKDIR /app

RUN apk update
RUN pip install --upgrade pip

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY app.py app.py

ENTRYPOINT FLASK_APP=./app.py flask run --host=0.0.0.0 --port=80