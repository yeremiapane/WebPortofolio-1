FROM ubuntu:latest
LABEL authors="yerem"

ENTRYPOINT ["top", "-b"]