FROM oraclelinux:8.7
LABEL name="rajk"
RUN yum install python3 -y
WORKDIR /bmo/rajkapp/
COPY myapp.py .
RUN useradd rajk
USER rajk
CMD [ "python3", "myapp.py"]