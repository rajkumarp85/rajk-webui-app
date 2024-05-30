FROM oraclelinux:8.7
LABEL name="rajk"
RUN yum install python3 -y
WORKDIR /bmo/rajkapp/
COPY myapp.py .
CMD [ "python3", "myapp.py"]