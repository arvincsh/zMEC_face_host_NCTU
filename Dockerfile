FROM ubuntu:18.04

RUN mkdir /home/work
WORKDIR /home/work

RUN apt update -y && apt install -y sudo && apt install -y vim && apt install -y curl && apt install -y git

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

RUN apt install -y nodejs

RUN git clone https://github.com/arvincsh/zMEC_face.git

WORKDIR /home/work/zMEC_face

RUN npm install -y express && npm install -y body-parser && npm install -y formidable && npm install -y fs && npm install -y path && npm install -y ejs

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get install -y tzdata && apt-get install -y libopencv-dev

RUN npm install -y opencv

RUN mkdir detected && mkdir upload

CMD [ "node", "/home/work/zMEC_face/app.js" ]

