FROM hypriot/rpi-node

RUN mkdir -p /usr/src/kettle-sqs-bridge
WORKDIR /usr/src/kettle-sqs-bridge
COPY . /usr/src/kettle-sqs-bridge

CMD [ "npm", "start" ]

