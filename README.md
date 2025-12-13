# Smartlend-lms

In case of adding new fields to tables, after adding, run 

```
flask db migrate -m " "
flask db upgrade
```