#!/usr/bin/env python3
"""simple flask app"""
from flask import Flask, render_template, request, g
from flask_babel import Babel


class Config(object):
    """configuration class"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


@babel.localeselector
def get_locale():
    """returns the appropiate locale"""
    locale = request.args.get("locale")
    if locale in Config.LANGUAGES:
        return locale
    return request.accept_languages.best_match(
            app.config["LANGUAGES"])


def get_user():
    """fetches a user"""
    user_id = request.args.get("login_as")
    if not user_id:
        return None
    return users.get(int(user_id))


@app.before_request
def before_request():
    """sets the global user for each request"""
    user = get_user()
    g.user = user


@app.route("/")
def index():
    """index route"""
    return render_template("5-index.html")

if __name__ == "__main__":
    app.run()
