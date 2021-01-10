## Integration tests module

### Run perf-tests

All tests:
```
sbt "gatling:test"
```

Single test:
```
sbt "gatling:testOnly org.chat.LoginITest"
```

Report:
```
sbt "gatling:lastReport"
```


Useful:
https://gatling.io/docs/current/cheat-sheet/
https://www.scala-sbt.org/1.x/docs/Testing.html