import logging

from odoo import api, fields, models, _


class ActWindowView(models.Model):
    _inherit = 'ir.actions.act_window.view'

    view_mode = fields.Selection(selection_add=[('map', "MAP View")], ondelete={'map': 'cascade'})


class View(models.Model):
    _inherit = 'ir.ui.view'

    type = fields.Selection(selection_add=[('map', "MAP View")], ondelete={'map': 'cascade'})