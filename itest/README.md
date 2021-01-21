# Integration tests module

## Run perf-tests

### All tests:
```
sbt gatling:test
```

### Single test:
```
sbt gatling:testOnly org.chat.auth.LoginTest
```

### Report:
```
sbt gatling:lastReport
```