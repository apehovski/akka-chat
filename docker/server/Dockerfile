FROM frolvlad/alpine-scala:2.12

COPY . /core/target/universal/stage /opt/app/

ENV JAVA_OPTS="-Xms512m -Xmx2048m -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=11001"

EXPOSE 8080

CMD [ "/opt/app/bin/core" ]
ENTRYPOINT [ "/bin/bash"]