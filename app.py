#!/usr/bin/python3

from flask import Flask
app = Flask("__main__")
@app.route("/")
def fun():
	return "Hello World new Test.8"
