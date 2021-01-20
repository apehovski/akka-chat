# 1. Build
FROM openjdk:8u121-jre-alpine AS builder

# Install SBT
ENV SBT_VERSION 1.4.6
ENV SBT_HOME /usr/local/sbt
ENV PATH ${PATH}:${SBT_HOME}/bin
RUN echo "installing SBT $SBT_VERSION" && \
    apk add --no-cache --update bash wget tar && \
    mkdir -p "$SBT_HOME" && \
    wget -qO - --no-check-certificate "https://github.com/sbt/sbt/releases/download/v$SBT_VERSION/sbt-$SBT_VERSION.tgz" | tar xz -C $SBT_HOME --strip-components=1 && \
    echo -ne "- with sbt $SBT_VERSION\n" >> /root/.built
WORKDIR /home
RUN sbt sbtVersion

# Packaging to runnable app
COPY /core /opt/app/
WORKDIR /opt/app
RUN sbt stage

# 2. Start
FROM frolvlad/alpine-scala:2.12
COPY --from=builder /opt/app/target/universal/stage /opt/app/

ENV JAVA_OPTS="-Xms512m -Xmx2048m -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=11001"

CMD [ "/opt/app/bin/core" ]
ENTRYPOINT [ "/bin/bash"]