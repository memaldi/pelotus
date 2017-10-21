FROM python:2

RUN apt-get update && apt-get install git

WORKDIR /src

RUN git clone https://github.com/memaldi/pelotus

WORKDIR /src/pelotus

RUN pip install -r requirements.txt

WORKDIR /src/pelotus/wsgi/pelotus

ENTRYPOINT entrypoint.sh
