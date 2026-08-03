"""Panel interno: dashboard principal."""
from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from extensions import db

from models import Event
from services import dashboard_stats

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/panel")
@login_required
def index():
    stats = dashboard_stats()
    recent_events = Event.query.order_by(Event.timestamp.desc()).limit(10).all()
    return render_template(
        "dashboard/index.html",
        stats=stats,
        recent_events=recent_events,
    )


@dashboard_bp.route("/configuracion")
@login_required
def settings():
    # Maneja GET para mostrar y POST para guardar la preferencia de tema
    if request.method == "POST":
        theme = request.form.get("theme")
        if theme in ("default", "dark", "neon"):
            current_user.theme = theme
            db.session.commit()
            flash("Tema actualizado.", "success")
        else:
            flash("Tema no válido.", "error")
        return redirect(url_for("dashboard.settings"))

    return render_template("dashboard/settings.html", active_page="settings")
