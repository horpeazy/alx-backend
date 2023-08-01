#!/usr/bin/env python3
"""simple flask app"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz


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
    url_locale = request.args.get("locale")
    if url_locale and url_locale in app.config["LANGUAGES"]:
        return url_locale

    if g.user:
        usr_locale = g.user.get("locale")
        if usr_locale and usr_locale in app.config["LANGUAGES"]:
            return usr_locale

    return request.accept_languages.best_match(
            app.config["LANGUAGES"])


@babel.timezoneselector
def get_timezone():
    """returns the appropriate timezone"""
    timezone = request.args.get("timezone")
    if not timezone:
        timezone = get_user_timezone()
    try:
        tzone = pytx.timezone(timezone)
        return tzone.zone
    except pytz.timezone.UnknownTimeZoneError:
        return app.config["BABEL_DEFAULT_TIMEZONE"]


def get_user_timezone():
    """gets the user timezone from settings"""
    if not g.user:
        return None
    user = get_user()
    return user.get("timezone")


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
    return render_template("7-index.html")


if __name__ == "__main__":
    app.run()
