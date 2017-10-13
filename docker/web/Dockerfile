FROM python:2

RUN sudo apt-get update && sudo apt-get install git

WORKDIR /src

RUN git clone https://github.com/memaldi/pelotus

WORKDIR /src/pelotus

RUN pip install -r requirements.txt

WORKDIR /src/pelotus/wsgi/pelotus

RUN python manage.py makemigrations

RUN python manage.py migrate
