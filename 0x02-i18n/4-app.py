#!/usr/bin/env python3
"""simple flask app"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """configuration class"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """returns the appropiate locale"""
    locale = request.args.get("locale")
    if locale in Config.LANGUAGES:
        return locale
    return request.accept_languages.best_match(
            app.config["LANGUAGES"])


@app.route("/")
def index():
    """index route"""
    return render_template("4-index.html")

if __name__ == "__main__":
    app.run()
